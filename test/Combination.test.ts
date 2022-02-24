import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Combination } from "../types";

describe("Sherlock CTF: Combination (saianmk)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let combination: Combination;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/saianmk/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy();
    } else {
      setup = await ethers.getContractAt(
        "contracts/saianmk/Setup.sol:Setup",
        `0xbFB2C43021629C87b83C97F1FAC8D5f6b1078593`
      );
    }
    combination = await ethers.getContractAt("Combination", await setup.combination());
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/saianmk/Exploit.sol:Exploit", attacker);
    const exploit = await ExploitFactory.deploy(combination.address);
    await exploit.attack();
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
