import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SwissTreasury } from "../types";

describe("Sherlock CTF: SwissTreasury (chaboo)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let swiss_treasury: SwissTreasury;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/chaboo/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("1") });
    } else {
      setup = await ethers.getContractAt(
        "contracts/chaboo/Setup.sol:Setup",
        `0x0a73CA730FaF56126487196a4B7E10B2A9B3df67`
      );
    }
    swiss_treasury = await ethers.getContractAt("SwissTreasury", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/chaboo/Exploit.sol:Exploit", attacker);
    const exploit = await ExploitFactory.deploy(swiss_treasury.address);
    await exploit.attack1();
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
