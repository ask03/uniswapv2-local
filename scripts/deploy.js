// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const USDC = hre.ethers.getContractFactory("USDC");
  const usdcAmnt = 100000000000000;

  let factory = await (await hre.ethers.getContractFactory("UniswapV2Factory")).deploy(deployer.address);
  await factory.deployed();
  console.log("Factory: ", factory.address);

  let weth = await (await hre.ethers.getContractFactory("WETH9")).deploy();
  await weth.deployed();
  console.log("WETH: ", weth.address);

  let usdc = await (await hre.ethers.getContractFactory("USDC")).deploy("USDC", "USDC", usdcAmnt);
  await usdc.deployed();
  console.log("USDC: ", usdc.address);

  let router = await (await hre.ethers.getContractFactory("UniswapV2Router02")).deploy(factory.address, weth.address);
  await router.deployed();
  console.log("Router: ", router.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
