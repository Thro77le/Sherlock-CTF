import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { BitMania } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Sherlock CTF: BitMania (hack3r-0m)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let bit_mania: BitMania;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/hack3r-0m/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy();
    } else {
      setup = await ethers.getContractAt(
        "contracts/hack3r-0m/Setup.sol:Setup",
        `0xA083913ed673b23dC5FB921b3909021CacFD794C`
      );
    }
    bit_mania = await ethers.getContractAt("BitMania", await setup.instance(), deployer);
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/hack3r-0m/Exploit.sol:Exploit", attacker);
    await ExploitFactory.deploy(bit_mania.address);
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
