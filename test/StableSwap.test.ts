import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { StableSwap2 } from "../types";

describe("Sherlock CTF: StableSwap (PeterisPrieditis) - UNSOLVED", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let stable_swap: StableSwap2;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/PeterisPrieditis/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("0.0000374") });
    } else {
      setup = await ethers.getContractAt(
        "contracts/PeterisPrieditis/Setup.sol:Setup",
        `0x64A9fcaD8D299aF9B1a96dA17458c0b3D876b687`
      );
    }
    stable_swap = await ethers.getContractAt("StableSwap2", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    // const ExploitFactory = await ethers.getContractFactory("contracts/PeterisPrieditis/Exploit.sol:Exploit", attacker);
    // const exploit = await ExploitFactory.deploy(stable_swap.address, setup.address);
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
