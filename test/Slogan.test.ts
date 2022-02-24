import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SloganProxy } from "../types";

describe("Sherlock CTF: Slogan (kuldeep23907)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let challenge: Contract;
  let proxy: SloganProxy;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/kuldeep23907/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("1") });
    } else {
      setup = await ethers.getContractAt(
        "contracts/kuldeep23907/Setup.sol:Setup",
        `0x0ABBC49482097b530516d385B4dD183b59073f1C`
      );
    }
    challenge = await ethers.getContractAt("contracts/kuldeep23907/Challenge.sol:Challenge", await setup.instance());
    proxy = await ethers.getContractAt("SloganProxy", await challenge.sloganContract());
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/kuldeep23907/Exploit.sol:Exploit", attacker);
    const exploit = await ExploitFactory.deploy(challenge.address, proxy.address, {
      value: ethers.utils.parseEther("1"),
    });
    await exploit.attack();
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
