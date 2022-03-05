const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();

    const GMMerchBundleFactory = await hre.ethers.getContractFactory('GMMerchBundle');
    const GMMerchBundle = await GMMerchBundleFactory.deploy();
    await GMMerchBundle.deployed();
    console.log("SHOP deployed to:", GMMerchBundle.address);

    const GMPFPFactory = await hre.ethers.getContractFactory('GMPFP');
    const GMPFP = await GMPFPFactory.deploy();
    await GMPFP.deployed();
    console.log("PFP deployed to:", GMPFP.address);

    await GMMerchBundle.updateMerchBundleStatus();
    // const overrides = { value: ethers.utils.parseEther('0.06')};
    // let txn = await GMMerchBundle.connect(randomPerson).mintMerch(overrides);
    // txn.wait();

    for (let i = 0; i < 77; i++) {
      let sndVal = String(0.15);
      const overrides = { value: ethers.utils.parseEther(sndVal)};
      (await GMMerchBundle.connect(randomPerson).mintMerch(overrides)).wait();
    }

    // WITHDRAW 
      // - check balance before
      // - check balance after
        let shopBal = await hre.ethers.provider.getBalance(GMMerchBundle.address);
        console.log('SHOP BALANCE/ ', shopBal );
        let ownerBal = await hre.ethers.provider.getBalance(owner.address);
        console.log('OWNER BALANCE/ ', ownerBal );
        console.log('================');
        console.log('WITHDRAW');
        console.log('================');
        let wd = await GMMerchBundle.connect(owner).withdraw();
        let newOwnerBal = await hre.ethers.provider.getBalance(owner.address);
        console.log('OWNER BALANCE/ ', newOwnerBal );
        wd.wait();
    //


    // let setSHOP = await GMPFP.setShopAddress(GMMerchBundle.address);
    // setSHOP.wait();

    // let approval = await GMMerchBundle.connect(randomPerson).setApprovalForAll(GMPFP.address, true);
    // approval.wait();
    
    // let mint = await GMPFP.connect(randomPerson).mintWithPass5();
    // mint.wait();
    // let mint2 = await GMPFP.connect(randomPerson).mintWithPass5();
    // mint2.wait();

    let supply = await GMMerchBundle.getMinted();

    console.log( 'Supply %s', supply);

  
    // let burn = await GMPFP.mintWithPass();

    // burn.wait();
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