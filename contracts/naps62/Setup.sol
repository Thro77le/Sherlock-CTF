// SPDX-License-Identifier: None
pragma solidity 0.8.1;

import "./ISetup.sol";
import "./BuiltByANoob.sol";

contract Setup is ISetup {
    BuiltByANoob public instance;

    address originalOwner;

    constructor() {
        originalOwner = msg.sender;
        instance = new BuiltByANoob();
        emit Deployed(address(instance));
    }

    function isSolved() external view override(ISetup) returns (bool) {
        return instance.won();
    }
}
