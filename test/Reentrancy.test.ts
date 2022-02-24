import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Sherlock CTF: Reentrancy (sidduHERE)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let quiz: Contract;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/sidduHERE/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("1") });
    } else {
      setup = await ethers.getContractAt(
        "contracts/sidduHERE/Setup.sol:Setup",
        `0x76BB80b4F1bA62eD2665f537f605C3593daCc458`
      );
    }
    quiz = await ethers.getContractAt(
      "contracts/sidduHERE/ExampleQuizExploit.sol:ExampleQuizExploit",
      await setup.instance()
    );
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/sidduHERE/Exploit.sol:Exploit", attacker);
    const exploit = await ExploitFactory.deploy(quiz.address);
    await exploit.attack({ value: ethers.utils.parseEther("1") });
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
