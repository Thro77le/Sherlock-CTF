// SPDX-License-Identifier: None
pragma solidity 0.8.1;

interface ISetup {
    event Deployed(address instance);

    function isSolved() external view returns (bool);
}
