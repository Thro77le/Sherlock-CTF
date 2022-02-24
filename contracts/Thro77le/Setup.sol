// Challenge name: Counterfactual
// Author: Throttle (@_no_handlebars)


pragma solidity 0.8.4;

import "./Factory.sol";
import "./Counterfactual.sol";

contract Setup {
    event Deployed(address);

    Factory public factory;
    Counterfactual public instance;

    constructor() {
        factory = new Factory();
        instance = new Counterfactual(address(factory));
        emit Deployed(address(instance));
    }

    function isSolved() external view returns (bool) {
        return instance.isSolved();
    }
}
