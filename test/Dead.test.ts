import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Dead } from "../types";

describe("Sherlock CTF: Dead (kankan-0)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let dead: Dead;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/kankan-0/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("0.1") });
    } else {
      setup = await ethers.getContractAt(
        "contracts/kankan-0/Setup.sol:Setup",
        `0x9e6C0511d07695420A0B57003d6e8c133Cd0185d`
      );
    }
    dead = await ethers.getContractAt("Dead", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/kankan-0/Exploit.sol:Exploit", attacker);
    await ExploitFactory.deploy(dead.address, { value: ethers.utils.parseEther("1") });
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
