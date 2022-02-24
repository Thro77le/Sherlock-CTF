import '@nomiclabs/hardhat-waffle';
import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import 'hardhat-log-remover';

import dotenv from "dotenv";
dotenv.config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";
const SHERLOCK_RPC_URL = process.env.SHERLOCK_RPC_URL || "";

if (ALCHEMY_API_KEY === '') throw new Error(`ALCHEMY_API_KEY env var not set`);
if (SHERLOCK_RPC_URL === '') throw new Error(`ARCHIVE_RPC_URL env var not set`);

const config: HardhatUserConfig = {
    solidity: {
      compilers: [
        { version: "0.8.11" },
        { version: "0.8.9" },
        { version: "0.8.7" },
        { version: "0.8.4" },
        { version: "0.8.1" },
        { version: "0.8.0" },
        { version: "0.7.6" },
        { version: "0.7.4" },
        { version: "0.7.3" },
        { version: "0.7.2" },
        { version: "0.7.0" },
      ],
    },
    defaultNetwork: "hardhat",
    networks: {
      sherlock: {
        url: `${SHERLOCK_RPC_URL}`,
        gasPrice: 900000000000,
      },
      hardhat: {
        gas: 999999999999,
        blockGasLimit: 100000000429720,
      },
      goerli_fork: {
        url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
        forking: {
          url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
          blockNumber: 6416670,
        },
      },
    },
    typechain: {
        outDir: "types",
        target: "ethers-v5",
    },
    mocha: {
      timeout: 400000
    }
  };

export default config;
