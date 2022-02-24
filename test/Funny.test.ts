import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { FunnyChallenges } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Sherlock CTF: Funny (ych18)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let funny: FunnyChallenges;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/ych18/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("2") });
    } else {
      setup = await ethers.getContractAt(
        "contracts/ych18/Setup.sol:Setup",
        `0x40D1e6Fa69957f4c66461b8c8AB60108265F52b2`
      );
    }
    funny = await ethers.getContractAt("FunnyChallenges", await setup.instance(), deployer);
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/ych18/Exploit.sol:Exploit", attacker);
    await ExploitFactory.deploy(funny.address, { value: ethers.utils.parseEther("2") });
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
