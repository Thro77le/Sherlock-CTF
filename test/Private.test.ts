import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Sherlock CTF: Private (johngish)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let challenge: Contract;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/johngish/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: 100 });
    } else {
      setup = await ethers.getContractAt(
        "contracts/johngish/Setup.sol:Setup",
        `0x427255B0e21A7f0D809c7cE854569A10df44378d`
      );
    }
    challenge = await ethers.getContractAt("contracts/johngish/Challenge.sol:Challenge", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/johngish/Exploit.sol:Exploit", attacker);
    const exploit = await ExploitFactory.deploy(challenge.address);
    await exploit.attack({ value: 100 });
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
