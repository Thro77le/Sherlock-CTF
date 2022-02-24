import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract } from "ethers";
import { PixelPavel } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Sherlock CTF: PixelPavel (ebaizel)", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let pixel_pavel: PixelPavel;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/ebaizel/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: 298 });
    } else {
      setup = await ethers.getContractAt(
        "contracts/ebaizel/Setup.sol:Setup",
        `0x5364B5A9e489b495CaAE4722e9706C817Cf54433`
      );
    }
    pixel_pavel = await ethers.getContractAt("PixelPavel", await setup.instance(), deployer);
  });

  it("Exploit", async () => {
    // Contract Attack
    const ExploitFactory = await ethers.getContractFactory("contracts/ebaizel/Exploit.sol:Exploit", attacker);
    await ExploitFactory.deploy(pixel_pavel.address, { value: 33 });
  });

  after(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
