import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { Inflation, InflationaryToken } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Sherlock CTF: Inflation (bahurum)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let inflation: Inflation;
  let inflationary_token: InflationaryToken;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/bahurum/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy();
    } else {
      setup = await ethers.getContractAt(
        "contracts/bahurum/Setup.sol:Setup",
        `0xABF1f66a9fb48F3f5b75C8A83FB5854A9d906343`
      );
    }
    inflation = await ethers.getContractAt("Inflation", await setup.instance(), deployer);
    inflationary_token = await ethers.getContractAt("InflationaryToken", await inflation.token(), deployer);
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/bahurum/Exploit.sol:Exploit", attacker);
    await ExploitFactory.deploy(inflationary_token.address, inflation.address);
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
