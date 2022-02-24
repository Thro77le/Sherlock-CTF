import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AmusementPark } from "../types";

describe("Sherlock CTF: AmusementPark (plotchy) - UNSOLVED", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let park: AmusementPark;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/plotchy/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy();
    } else {
      setup = await ethers.getContractAt(
        "contracts/plotchy/Setup.sol:Setup",
        `0x869a2D3856BE26cfE77cC7Cb6579219d13373Bc9`
      );
    }
    park = await ethers.getContractAt("AmusementPark", await setup.instance());
  });

  it("Exploit", async () => {
    // Contract Attack
    // const ExploitFactory = await ethers.getContractFactory("contracts/plotchy/Exploit.sol:Exploit", attacker);
    // const exploit = await ExploitFactory.deploy(park.address);
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
