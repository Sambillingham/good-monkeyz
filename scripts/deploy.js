const main = async () => {
  const GMMerchBundleFactory = await hre.ethers.getContractFactory('GMMerchBundleGeneric');
  const GMMerchBundle = await GMMerchBundleFactory.deploy();
  await GMMerchBundle.deployed();
  console.log("SHOP deployed to:", GMMerchBundle.address);

  // const GMPFPFactory = await hre.ethers.getContractFactory('GMPFP');
  // const GMPFP = await GMPFPFactory.deploy();
  // await GMPFP.deployed();
  // console.log("PFP deployed to:", GMPFP.address);
};
  
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();