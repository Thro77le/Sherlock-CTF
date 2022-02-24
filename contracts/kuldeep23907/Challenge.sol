// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/proxy/Proxy.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Upgrade.sol";

contract Challenge {
    address public sloganContract; // proxy

    // @audit-info steal 1ETH from this contract
    constructor(address _contract) payable {
        sloganContract = _contract;
    }

    function callSloganContract(bytes memory data) public payable {
        require((sloganContract) != address(0), "Slogan contract  == 0");
        (bool success, ) = (sloganContract).delegatecall(data);
        require(success, "call failed!");
    }
}

contract Slogan {
    string public slogan;
    address public currentSloganOwner;

    function setSlogan(string memory _str) public payable returns (bool) {
        require(msg.value == 0.001 ether);
        slogan = _str;
        currentSloganOwner = msg.sender;
        return true;
    }
}

contract InitialiazableUpgradeableProxy is Proxy, ERC1967Upgrade {

    // @audit-ok
    function initialize(address _logic, bytes memory _data) public payable {
        require(_implementation() == address(0), "Proxy: Iplementation address already set");
        assert(_IMPLEMENTATION_SLOT == bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1));
        _upgradeTo(_logic);
        if (_data.length > 0) {
            (bool success, ) = _logic.delegatecall(_data);
            require(success);
        }
    }

    // @audit-ok
    function _implementation()
        internal
        view
        virtual
        override
        returns (address impl)
    {
        return _getImplementation();
    }
}

contract SloganProxy is InitialiazableUpgradeableProxy {}
