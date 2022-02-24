pragma solidity 0.8.0;

import "./Challenge.sol";


contract Setup {
    Challenge public instance;

    event Deployed(address instance);
    constructor() payable {
        instance = new Challenge();

        emit Deployed(address(instance));
    }

    function isSolved() external view returns (bool) {
        address govToken = instance.govTokens(0);
        return GovToken(govToken).balanceOf(address(instance)) == 0;
    }
}
