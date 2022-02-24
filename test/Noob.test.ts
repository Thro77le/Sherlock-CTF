import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BuiltByANoob } from "../types";

describe("Sherlock CTF: Noob (naps62)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let noob: BuiltByANoob;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/naps62/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy();
    } else {
      setup = await ethers.getContractAt(
        "contracts/naps62/Setup.sol:Setup",
        `0x4742FD1862E94dc74AeD62A96B6374E68e658f80`
      );
    }
    noob = await ethers.getContractAt("BuiltByANoob", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/naps62/Exploit.sol:Exploit", attacker);
    await ExploitFactory.deploy(noob.address);
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
