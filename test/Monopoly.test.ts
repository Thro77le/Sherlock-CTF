import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Monopoly } from "../types";

describe("Sherlock CTF: Monopoly (t-nero)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let monopoly: Monopoly;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/t-nero/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("1") });
    } else {
      setup = await ethers.getContractAt(
        "contracts/t-nero/Setup.sol:Setup",
        `0x34e5EC7DA55039f332949a6d7dB506cD94594E12`
      );
    }
    monopoly = await ethers.getContractAt("Monopoly", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/t-nero/Exploit.sol:Exploit", attacker);
    const exploit = await ExploitFactory.deploy(monopoly.address, { value: ethers.utils.parseEther("2") });
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
