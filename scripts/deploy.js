// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const fsLibrary  = require('fs')
    
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const USDC = hre.ethers.getContractFactory("USDC");
  const usdcAmnt = 100000000000000;

  let factory = await (await hre.ethers.getContractFactory("UniswapV2Factory")).deploy(deployer.address);
  await factory.deployed();
  let str = "factory=" + factory.address.toString() + "\n";
  console.log("Factory: ", factory.address);
  fsLibrary.appendFile('deployAddresses.txt', str, (error) => {
    // In case of a error throw err exception.
    if (error) throw err;
  })

  let weth = await (await hre.ethers.getContractFactory("WETH9")).deploy();
  await weth.deployed();
  console.log("WETH: ", weth.address);
  str = "weth=" + weth.address.toString() + "\n";
  fsLibrary.appendFile('deployAddresses.txt', str, (error) => {
    // In case of a error throw err exception.
    if (error) throw err;
  })

  let usdc = await (await hre.ethers.getContractFactory("USDC")).deploy("USDC", "USDC", usdcAmnt);
  await usdc.deployed();
  str = "usdc=" + usdc.address.toString() + "\n";
  console.log("USDC: ", usdc.address);
  fsLibrary.appendFile('deployAddresses.txt', str, (error) => {
    // In case of a error throw err exception.
    if (error) throw err;
  })

  let router = await (await hre.ethers.getContractFactory("UniswapV2Router02")).deploy(factory.address, weth.address);
  await router.deployed();
  str = "router=" + router.address.toString() + "\n";
  console.log("Router: ", router.address);
  fsLibrary.appendFile('deployAddresses.txt', str, (error) => {
    // In case of a error throw err exception.
    if (error) throw err;
  })

  await factory.createPair(usdc.address, weth.address);
  let pairAddr = await factory.getPair(usdc.address, weth.address);

  // Write data in 'newfile.txt' .


  console.log("pair created: WETH & USDC: ", pairAddr);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
