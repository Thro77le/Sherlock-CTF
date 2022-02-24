import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Unbreakable } from "../types";

describe("Sherlock CTF: Unbreakable (RomiRand) - UNSOLVED", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let unbreakable: Unbreakable;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/RomiRand/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy();
    } else {
      setup = await ethers.getContractAt(
        "contracts/RomiRand/Setup.sol:Setup",
        `0x85CCd0c58Fe07DC6716f1EfCcAba0164b97ae66B`
      );
    }
    unbreakable = await ethers.getContractAt("Unbreakable", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    // const ExploitFactory = await ethers.getContractFactory("contracts/RomiRand/Exploit.sol:Exploit", attacker);
    // const exploit = await ExploitFactory.deploy(unbreakable.address);
    // await exploit.attack();
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
