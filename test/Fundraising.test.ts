import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Fundraising } from "../types";

describe("Sherlock CTF: Fundraising (tqtsar)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let fundraising: Fundraising;

  const GWEI = 1_000_000_000;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/tqtsar/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: 1_000 * GWEI });
    } else {
      setup = await ethers.getContractAt(
        "contracts/tqtsar/Setup.sol:Setup",
        `0x0dCb022a9927613f1B4B23F4F893515BA196c5c5`
      );
    }
    fundraising = await ethers.getContractAt("Fundraising", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/tqtsar/Exploit.sol:Exploit", attacker);
    const exploit = await ExploitFactory.deploy(fundraising.address, { value: ethers.utils.parseEther("2") });
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
