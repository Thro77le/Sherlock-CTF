import {Signer} from 'ethers';
import { ethers } from "hardhat";

const getScore = async (name: string, address: string, eoa: Signer) => {
  if (name == "0xNazgul" || name == "KahanMajmudar")
  {
    console.log(`${name.padEnd(20)} ${"--- NO ---"}`);
    return 0;
  }

  const setup = await ethers.getContractAt(`contracts/${name}/Setup.sol:Setup`, address, eoa);
  if (await setup.isSolved()) {
    console.log(`${name.padEnd(20)} ${"- SOLVED -"}`);
    return 1;
  } else {
    console.log(`${name.padEnd(20)} ${"----------"}`);
    return 0;
  }
}

async function main() {
  let score = 0;
  const [attacker] = await ethers.getSigners();

  score += await getScore("0xmoostorm", "0x5e40D0d98126323b81246008d386a93BA091704f", attacker);
  score += await getScore("0xNazgul", "0xd80960575d177A09FEb8497dBaE9F6583fcFe297", attacker);
  score += await getScore("agusduha", "0x459D9C80482c541deC1Aa491209EF598BF7c9344", attacker);
  score += await getScore("bahurum", "0xABF1f66a9fb48F3f5b75C8A83FB5854A9d906343", attacker);
  score += await getScore("band0x", "0x46C9489797c5647F850dD3A5bcB13C240bcd383A", attacker);
  score += await getScore("Baraa42", "0xFfb20eF6668F8160934FD84b60F3DeD127F787Aa", attacker);
  score += await getScore("BowTiedPickle", "0xfF2c41d306098Ce69316C781137EaF05FABDFF6b", attacker);
  score += await getScore("chaboo", "0x0a73CA730FaF56126487196a4B7E10B2A9B3df67", attacker);
  score += await getScore("ebaizel", "0x5364B5A9e489b495CaAE4722e9706C817Cf54433", attacker);
  score += await getScore("hack3r-0m", "0xA083913ed673b23dC5FB921b3909021CacFD794C", attacker);
  score += await getScore("iflp", "0x38B500E61267Ee672c823bE3a8fA559236Bd1FD3", attacker);
  score += await getScore("johngish", "0x427255B0e21A7f0D809c7cE854569A10df44378d", attacker);
  score += await getScore("JustDravee", "0x1f5c09a7d6a9B30b43DDDAABD384425DEe0ADe91", attacker);
  score += await getScore("kankan-0", "0x9e6C0511d07695420A0B57003d6e8c133Cd0185d", attacker);
  score += await getScore("kuldeep23907", "0x0ABBC49482097b530516d385B4dD183b59073f1C", attacker);
  score += await getScore("KahanMajmudar", "0x", attacker);
  score += await getScore("lucyoa", "0xe95dF719Fc223CD8E57bA9bAAb8E86bEDF3e5d69", attacker);
  score += await getScore("luksgrin", "0x9BDCf71048DFd8ef1C03a7ae3EDe79F04A096B7F", attacker);
  score += await getScore("mhchia", "0x6c06959586640De3BcdE69BDcEbF2efDa5d3983B", attacker);
  score += await getScore("naps62", "0x4742FD1862E94dc74AeD62A96B6374E68e658f80", attacker);
  score += await getScore("PeterisPrieditis", "0x64A9fcaD8D299aF9B1a96dA17458c0b3D876b687", attacker);
  score += await getScore("plotchy", "0x869a2D3856BE26cfE77cC7Cb6579219d13373Bc9", attacker);
  score += await getScore("RomiRand", "0x85CCd0c58Fe07DC6716f1EfCcAba0164b97ae66B", attacker);
  score += await getScore("saianmk", "0xbFB2C43021629C87b83C97F1FAC8D5f6b1078593", attacker);
  score += await getScore("sidduHERE", "0x76BB80b4F1bA62eD2665f537f605C3593daCc458", attacker);
  score += await getScore("smbsp", "0x838Ed804d95044516C16473C91388AE195da0B76", attacker);
  score += await getScore("t-nero", "0x34e5EC7DA55039f332949a6d7dB506cD94594E12", attacker);
  score += await getScore("teryanarmen", "0xAD392F2a981bDE60B43eC988a30ce2aE2d755eD2", attacker);
  score += await getScore("Thro77le", "0xBF3e5530aB7Dcba712E3A7fA99463d46eb6a0c8e", attacker);
  score += await getScore("tqtsar", "0x0dCb022a9927613f1B4B23F4F893515BA196c5c5", attacker);
  // score += await getScore("wuwe1", "0xB1F9187d9FFCd22fE2c26FeF3E8b8F90C31Ae885", attacker);
  score += await getScore("ych18", "0x40D1e6Fa69957f4c66461b8c8AB60108265F52b2", attacker);


  console.log("Score: ", score);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
