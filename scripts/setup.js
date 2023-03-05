// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const fs = require('fs')
const contractAddrs = fs.readFileSync('deployAddresses.txt').toString().split('\n').map(line => line.split('='));
const wethAddr = contractAddrs.filter(pair => pair[0] == 'weth')[0][1];
const usdcAddr = contractAddrs.filter(pair => pair[0] == 'usdc')[0][1];
const routerAddr = contractAddrs.filter(pair => pair[0] == 'router')[0][1];
const pairAddr = contractAddrs.filter(pair => pair[0] == 'pair')[0][1];
    
async function main() {
  const [deployer] = await hre.ethers.getSigners();

  let weth = await (await hre.ethers.getContractFactory("WETH9")).attach(wethAddr);
  let usdc = await (await hre.ethers.getContractFactory("USDC")).attach(usdcAddr);
  let router = await (await hre.ethers.getContractFactory("UniswapV2Router02")).attach(routerAddr);

  await weth.deposit({ value: hre.ethers.utils.parseEther("1000.0") });

  console.log("deployer WETH balance: ", hre.ethers.utils.formatEther(await weth.balanceOf(deployer.address)));
  const aa = '0xc5e61c05aff01cbe4c799C48bB25A757B0ED61f2'; // stackup-erc-4337-examples$ yarn run simpleAccount address
  console.log("AA WETH balance: ", hre.ethers.utils.formatEther(await weth.balanceOf(aa)));
  console.log("deployer USDC balance : ", hre.ethers.utils.formatUnits(await usdc.balanceOf(deployer.address), 6));

  let factoryAddr = await router.factory();
  console.log("factory addr: ", factoryAddr);

  await usdc.approve(routerAddr, '100000000000000');
  await weth.approve(routerAddr, hre.ethers.utils.parseEther("1000.0"));
  await router.addLiquidity(weth.address, usdc.address, hre.ethers.utils.parseEther("1000.0"), hre.ethers.utils.parseUnits('15000000', 6), hre.ethers.utils.parseEther("1000.0"), hre.ethers.utils.parseUnits('15000000', 6),
  deployer.address, '1678451746' );
  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
