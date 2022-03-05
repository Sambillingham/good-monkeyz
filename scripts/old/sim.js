const main = async () => {
    const [owner, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13,r14, r15, r16, r17, r18, r19] = await hre.ethers.getSigners();

    const GMMerchBundleFactory = await hre.ethers.getContractFactory('GMMerchBundleGeneric');
    const GMMerchBundle = await GMMerchBundleFactory.deploy();
    await GMMerchBundle.deployed();
    console.log("MERCH BUNDLE deployed to:", GMMerchBundle.address);

    const GMPFPFactory = await hre.ethers.getContractFactory('GMPFP');
    const GMPFP = await GMPFPFactory.deploy();
    await GMPFP.deployed();
    // console.log("PFP deployed to:", GMPFP.address);

    console.log('r20', r19.address)

    // Set Allow Address - 50
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

    let al1 = await GMMerchBundle.connect(owner).checkAllowList(r1.address);
    let al11 = await GMMerchBundle.connect(owner).checkAllowList(r11.address);
    console.log('Number of Mints on Allow List %s: ', ethers.utils.formatUnits(al1, 0))
    console.log('Number of Mints on Allow List %s: ', ethers.utils.formatUnits(al11, 0))

    const overrides = { value: ethers.utils.parseEther('0.2')};
    [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19 ].forEach(async r => {
        let mint = await (await GMMerchBundle.connect(r).mintTokenAllow(0,overrides)).wait();
        console.log('MINT ALLOW LIST : %s', mint.transactionHash);
    })

    await GMMerchBundle.updateMerchDetails(0, 250, ethers.utils.parseEther('0.06'), ethers.utils.parseEther('0.005'), true, true);
    // const overrides = { value: ethers.utils.parseEther('0.06')};
    // let txn = await GMMerchBundle.connect(randomPerson).mintMerch(overrides);
    // txn.wait();

    for (let i = 0; i < 30; i++) {
      let sndVal = String(0.2);
      const overrides = { value: ethers.utils.parseEther(sndVal)};
      let mint = await (await GMMerchBundle.connect(r1).mintToken(0,overrides)).wait();
      console.log('MINT OPEN LIST : %s', mint.transactionHash);
    }
    console.log('----------------------');
    // WITHDRAW 
      // - check balance before
      // - check balance after
        let shopBal = await hre.ethers.provider.getBalance(GMMerchBundle.address);
        console.log('SHOP BALANCE/ ', ethers.utils.formatEther(shopBal) );
        let ownerBal = await hre.ethers.provider.getBalance(owner.address);
        console.log('OWNER BALANCE/ ', ethers.utils.formatEther(ownerBal) );
        console.log('================');
        console.log('WITHDRAW');
        console.log('================');
        let wd = await GMMerchBundle.connect(owner).withdraw();
        let newOwnerBal = await hre.ethers.provider.getBalance(owner.address);
        console.log('SHOP BALANCE/ ', ethers.utils.formatEther(shopBal) );
        console.log('OWNER BALANCE/ ', ethers.utils.formatEther(newOwnerBal) );
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
    let price = await GMMerchBundle.getPrice();

    console.log('MERCH MINTED %s', ethers.utils.formatUnits( supply[0], 0) );
    console.log('MERCH PRICE %s', ethers.utils.formatEther( price[0]) );

  
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