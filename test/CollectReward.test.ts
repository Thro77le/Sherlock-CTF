import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { CollectReward } from "../types";

describe("Sherlock CTF: CollectReward (smbsp)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let collect_reward: CollectReward;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/smbsp/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("1") });
    } else {
      setup = await ethers.getContractAt(
        "contracts/smbsp/Setup.sol:Setup",
        `0x838Ed804d95044516C16473C91388AE195da0B76`
      );
    }
    collect_reward = await ethers.getContractAt("CollectReward", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/smbsp/Exploit.sol:Exploit", attacker);
    await ExploitFactory.deploy(collect_reward.address, { value: ethers.utils.parseEther("1") });
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
