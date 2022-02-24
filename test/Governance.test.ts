import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Sherlock CTF: Governance (lucyoa) - UNSOLVED", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let governance: Contract;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();
    if (hre.network.name === "hardhat") {
      console.log("run this test with --network goerli_fork");
      return;
    }
    if (hre.network.name === "goerli_fork") {
      const SetupFactory = await ethers.getContractFactory("contracts/lucyoa/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy();
    } else {
      setup = await ethers.getContractAt(
        "contracts/lucyoa/Setup.sol:Setup",
        `0xe95dF719Fc223CD8E57bA9bAAb8E86bEDF3e5d69`
      );
    }
    governance = await ethers.getContractAt("contracts/lucyoa/Setup.sol:Setup", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    // const ExploitFactory = await ethers.getContractFactory("contracts/lucyoa/Exploit.sol:Exploit", attacker);
    // const exploit = await ExploitFactory.deploy(governance.address);
    // await exploit.attack();
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
