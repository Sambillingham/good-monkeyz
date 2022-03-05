const main = async () => {
    const [owner, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13,r14, r15, r16, r17, r18, r19] = await hre.ethers.getSigners();

    const GMMerchBundleFactory = await hre.ethers.getContractFactory('GMMerchStrut');
    const GMMerchBundle = await GMMerchBundleFactory.deploy();
    await GMMerchBundle.deployed();
    console.log("MERCH BUNDLE deployed to:", GMMerchBundle.address);

    // const GMPFPFactory = await hre.ethers.getContractFactory('GMPFP');
    // const GMPFP = await GMPFPFactory.deploy();
    // await GMPFP.deployed();
    // console.log("PFP deployed to:", GMPFP.address);

    await GMMerchBundle.connect(owner).setAllowList(
      [r1.address,
       r2.address,
       r3.address,
       r4.address,
       r5.address,
       r6.address,
       r7.address,
       r8.address,
       r9.address,
       r10.address,
       r11.address,
       r12.address,
       r13.address,
       r14.address,
       r15.address,
       r16.address,
       r17.address,
       r18.address,
       r19.address]
      );
    
    await GMMerchBundle.connect(owner).createMerchItem(77, ethers.utils.parseEther('0.07'), ethers.utils.parseEther('0.001') )
    await GMMerchBundle.connect(owner).createMerchItem(77, ethers.utils.parseEther('0.1'), ethers.utils.parseEther('0.001') )

    let merch0 = await GMMerchBundle.connect(owner).merch(0);
    
    console.log(merch0)
    // const merchCount = await GMMerchBundle.connect(owner).getMerchCount();
    // console.log(merchCount)
    merch0 = await GMMerchBundle.connect(owner).updateMerchItem(
        0, 
        300,
        ethers.utils.parseEther('0.08'),
        ethers.utils.parseEther('0.005'),
        true,
        true,
        true );
    
        await GMMerchBundle.connect(owner).updateMerchItem(
          1, 
          300,
          ethers.utils.parseEther('0.08'),
          ethers.utils.parseEther('0.005'),
          true,
          true,
          true );

    merch0 = await GMMerchBundle.connect(owner).merch(0);
    console.log(merch0)

    al = await GMMerchBundle.connect(owner).allowList(r1.address)
    console.log(al)

    const overrides = { value: ethers.utils.parseEther('0.2')};
    let mint = await (await GMMerchBundle.connect(r1).mintTokenAllow(0,overrides)).wait();
    console.log(mint.transactionHash)
    let mint2 = await (await GMMerchBundle.connect(r1).mintTokenAllow(1,overrides)).wait();
    console.log(mint2.transactionHash)

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