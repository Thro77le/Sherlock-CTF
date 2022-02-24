import chai, { expect } from "chai";
import hre, { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";

import { Contract } from "ethers";
import { FloraToken } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);

describe("Sherlock CTF: FloraToken (0xNazgul) - UNSOLVED", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let setup: Contract;
  let flora_token: FloraToken;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/0xNazgul/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy({ value: ethers.utils.parseEther("1") });

      const flora_token_address = await setup.instance();
      flora_token = await ethers.getContractAt("FloraToken", flora_token_address, deployer);
    } else {
      setup = await ethers.getContractAt(
        "contracts/0xNazgul/Setup.sol:Setup",
        `0xd80960575d177A09FEb8497dBaE9F6583fcFe297`
      );
      flora_token = await ethers.getContractAt("FloraToken", `0x75b665c3695293659949c18719d046089F423834`);
    }
  });

  it("Exploit", async () => {
    // const ExploitFactory = await ethers.getContractFactory("contracts/0xNazgul/Exploit.sol:Exploit", attacker);
    // await ExploitFactory.deploy(flora_token.address);
  });

  afterEach(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
