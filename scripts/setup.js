// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const fs = require('fs')
const contractAddrs = fs.readFileSync('deployAddresses.txt').toString().split('\n').map(line => line.split('='));
const wethAddr = contractAddrs.filter(pair => pair[0] == 'weth')[0][1]
    
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  // let weth = await hre.ethers.getContractAt('WETH9', wethAddr /*, deployer*/)
  let weth = await (await hre.ethers.getContractFactory("WETH9")).attach(wethAddr)
  // console.log(weth)
  // let weth = await (await hre.ethers.getContractFactory("WETH9")).attach(wethAddr);
  await weth.deposit({ value: ethers.utils.parseEther("10.0") });
  // await weth.balanceOf(deployer.address);
  console.log("deployer WETH balance: ", ethers.utils.formatEther(await weth.balanceOf(deployer.address)));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
