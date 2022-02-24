// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract StableSwap2 is Ownable, ReentrancyGuard {
    uint256 public supply;
    IERC20[] public underlying;
    mapping(address => bool) public hasUnderlying;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public approvals;

    struct MintVars {
        uint256 totalSupply;
        uint256 totalBalanceNorm;
        uint256 totalInNorm;
        uint256 amountToMint;
        IERC20 token;
        uint256 has;
        uint256 preBalance;
        uint256 postBalance;
        uint256 deposited;
    }
    struct BuyBack {
        address sender;
    }

    // @audit-info - Only called once in setup. But its public...
    // @audit-info - end effect is: supply = 30k and balances[setup] = 30k
    // @audit-info - end effect is: supply = 1k and balances[me] = 1k
    function mint(uint256[] memory amounts) public nonReentrant returns (uint256) {
        MintVars memory v;
        v.totalSupply = supply;

        for (uint256 i = 0; i < underlying.length; i++) {
            v.token = underlying[i];

            v.preBalance = v.token.balanceOf(address(this));

            v.has = v.token.balanceOf(msg.sender);
            if (amounts[i] > v.has) {
                amounts[i] = v.has;
            }

            v.token.transferFrom(msg.sender, address(this), amounts[i]);

            v.postBalance = v.token.balanceOf(address(this));

            v.deposited = v.postBalance - v.preBalance;

            v.totalBalanceNorm += v.preBalance;
            v.totalInNorm += v.deposited;
        }


        if (v.totalSupply == 0) {
            v.amountToMint = v.totalInNorm;
        } else {
            v.amountToMint =
                (v.totalInNorm * v.totalSupply) /
                v.totalBalanceNorm;
        }
        supply += v.amountToMint;
        balances[msg.sender] += v.amountToMint;
        return v.amountToMint;
    }

    struct BurnVars {
        uint256 supply;
        uint256 haveBalance;
        uint256 sendBalance;
    }


    // @audit-issue - burn()
    function burn(uint256 amount) public nonReentrant {
        require(balances[msg.sender] >= amount, "burn/low-balance");
        BurnVars memory v;
        v.supply = supply;
        for (uint256 i = 0; i < underlying.length; i++) {
            v.haveBalance = underlying[i].balanceOf(address(this));
            v.sendBalance = (v.haveBalance * amount) / v.supply;

            underlying[i].transfer(msg.sender, v.sendBalance);
        }
        supply -= amount;
        balances[msg.sender] -= amount;
    }

    function donate(uint256 amount) public nonReentrant {
        require(balances[msg.sender] >= amount, "donate/low-balance");
        require(amount > 0, "donate/zero-amount");
        BuyBack storage buyBack;
        buyBack.sender = address(msg.sender);
        supply -= amount;
        balances[buyBack.sender] -= amount;
    }

    function swap(address src, uint256 srcAmt, address dst) public nonReentrant {
        require(hasUnderlying[src], "swap/invalid-src");
        require(hasUnderlying[dst], "swap/invalid-dst");

        IERC20 srcToken = IERC20(src);
        IERC20 dstToken = IERC20(dst);

        uint preBalance = srcToken.balanceOf(address(this));
        srcToken.transferFrom(msg.sender, address(this), srcAmt);
        uint postBalance = srcToken.balanceOf(address(this));

        uint input = ((postBalance - preBalance) * 997) / 1000;
        uint output = input;
        preBalance = dstToken.balanceOf(address(this));

        dstToken.transfer(msg.sender, output);

        postBalance = dstToken.balanceOf(address(this));
        uint sent = preBalance - postBalance;

        require(sent <= output, "swap/bad-token");
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "transfer/low-balance");
        unchecked {
            balances[msg.sender] -= amount;
            balances[to] += amount;
        }
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(approvals[from][msg.sender] >= amount, "transferFrom/low-approval");
        require(balances[from] >= amount, "transferFrom/low-balance");
        approvals[from][msg.sender] -= amount;
        balances[from] -= amount;
        balances[to] += amount;
        return true;
    }

    function approve(address who, uint256 amount) public returns (bool) {
        approvals[msg.sender][who] = amount;
        return true;
    }

    function totalValue() public view returns (uint256) {
        uint256 value = 0;
        for (uint256 i = 0; i < underlying.length; i++) {
            value += underlying[i].balanceOf(address(this));
        }
        return value;
    }

    function addCollateral(address collateral) public onlyOwner {
        underlying.push(IERC20(collateral));
        hasUnderlying[collateral] = true;
    }
}
