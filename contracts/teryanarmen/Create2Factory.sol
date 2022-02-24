pragma solidity 0.8.4;

import "./Exploit.sol";

contract Create2Factory {
	event Deployed(address addr, uint256 salt);

	// Get bytecode of contract to be deployed
	function getBytecode(address constructor_arg1) public pure returns (bytes memory) {
		bytes memory creation_code = type(Exploit).creationCode;
		return abi.encodePacked(creation_code, abi.encode(constructor_arg1));
	}

    // Compute the address of the contract to be deployed
    function getAddress(bytes memory bytecode, uint256 salt) public view returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode))
        );

        return address(uint160(uint(hash)));
    }

    function deploy(bytes memory bytecode, uint256 salt) public {
        address addr;

        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        // assembly {
        //     addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        // }
        // require(addr != address(0), "CREATE2: returned 0 address");
        emit Deployed(addr, salt);
    }
}