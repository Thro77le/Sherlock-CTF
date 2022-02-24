import chai, { expect } from "chai";
import hre, { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";

import { Contract } from "ethers";
import { CollisionExchange } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);

describe("Sherlock CTF: CollisionExchange (0xmoostorm)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let collision_exchange: CollisionExchange;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/0xmoostorm/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("1") });

      const collision_exchange_address = await setup.exchange();
      collision_exchange = await ethers.getContractAt("CollisionExchange", collision_exchange_address, deployer);
    } else {
      setup = await ethers.getContractAt(
        "contracts/0xmoostorm/Setup.sol:Setup",
        `0x5e40D0d98126323b81246008d386a93BA091704f`
      );
      const collision_exchange_address = await setup.exchange();
      collision_exchange = await ethers.getContractAt(
        "CollisionExchange",
        `0xE442a00a4587677c945598e19DF41822e851c1DE`
      );
    }
  });

  it("Exploit", async () => {
    const ExploitFactory = await ethers.getContractFactory("contracts/0xmoostorm/Exploit.sol:Exploit", attacker);
    await ExploitFactory.deploy(collision_exchange.address);
  });

  afterEach(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
