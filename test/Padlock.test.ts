import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { Padlock } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Sherlock CTF: Padlock (BowTiedPickle)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let padlock: Padlock;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/BowTiedPickle/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy();
    } else {
      setup = await ethers.getContractAt(
        "contracts/BowTiedPickle/Setup.sol:Setup",
        `0xfF2c41d306098Ce69316C781137EaF05FABDFF6b`
      );
    }
    padlock = await ethers.getContractAt("Padlock", await setup.instance(), deployer);
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/BowTiedPickle/Exploit.sol:Exploit", attacker);
    await ExploitFactory.deploy(padlock.address, { value: 33 });
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
