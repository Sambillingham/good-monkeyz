require('dotenv').config();

const main = async () => {
    const accounts = await hre.ethers.getSigners();

    const GMPFPFactory = await hre.ethers.getContractFactory('GoodMonkeyz');
    const GMPFP = await GMPFPFactory.deploy();
    await GMPFP.deployed();
    console.log("GoodMonkeyz PFP deployed to:", GMPFP.address);

    const owner = accounts[0];

    // OPEN -
    GMPFP.connect(owner).flipAllowState();

    // MAINLINK ACCOUNT SIGNATURE    
    const sig  = '0x8b81f734f5140d701b9f316cca401de8b3ad4ce861231a94ebc581141bd1b6bf3e001ca4408f54cd63b201f5b4673cc915da93561bec420f911a52af1fd4208e1b'
    let overrides = { value: ethers.utils.parseEther(String(0.077*2))};
    let mint = await (await GMPFP.connect(accounts[1]).mintAllow(2, sig,overrides)).wait();
    
    console.log('TOTAL: ', await GMPFP.connect(owner).totalSupply())
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