import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { BecomeMaster } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Sherlock CTF: BecomeMaster (band0x)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let become_master: BecomeMaster;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/band0x/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("0.001") });
    } else {
      setup = await ethers.getContractAt(
        "contracts/band0x/Setup.sol:Setup",
        `0x46C9489797c5647F850dD3A5bcB13C240bcd383A`
      );
    }
    become_master = await ethers.getContractAt("BecomeMaster", await setup.instance(), deployer);
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/band0x/Exploit.sol:Exploit", attacker);
    await ExploitFactory.deploy(become_master.address);
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
