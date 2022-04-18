require('dotenv').config();

const main = async () => {
    const accounts = await hre.ethers.getSigners();
    const rAccount = () => {
        const r = Math.floor(Math.random() * 100);
        return accounts[r];
    }
    let signatures = [];
    let pfpSignatures = [0];
    const GMMerchFactory = await hre.ethers.getContractFactory('GMMerch');
    const GMMerch = await GMMerchFactory.deploy();
    await GMMerch.deployed();
    console.log("MERCH BUNDLE deployed to:", GMMerch.address);
    
    const GMPFPFactory = await hre.ethers.getContractFactory('GoodMonkeyz');
    const GMPFP = await GMPFPFactory.deploy();
    await GMPFP.deployed();
    console.log("GoodMonkeyz PFP deployed to:", GMPFP.address);

    const owner = accounts[0];
    await GMMerch.connect(owner).createMerchItem(250, ethers.utils.parseEther('0.07'), ethers.utils.parseEther('0.007') )
    await GMMerch.connect(owner).createMerchItem(250, ethers.utils.parseEther('0.1'), ethers.utils.parseEther('0.001') )
    await GMMerch.connect(owner).createMerchItem(250, ethers.utils.parseEther('0.1'), ethers.utils.parseEther('0.001') )
    await GMMerch.connect(owner).updateMerchItem(
        0, 
        250,
        ethers.utils.parseEther('0.07'),
        ethers.utils.parseEther('0.007'),
        7,
        true,
        true,
        true );
   await GMMerch.connect(owner).updateMerchItem(
          1, 
          250,
          ethers.utils.parseEther('0.1'),
          ethers.utils.parseEther('0.00'),
          250,
          false,
          false,
          false );
    await GMMerch.connect(owner).updateMerchItem(
      2, 
      250,
      ethers.utils.parseEther('0.1'),
      ethers.utils.parseEther('0.00'),
      250,
      true,
      true,
      true );
    
    let price = 0.07;
    for (let i = 0; i < 250; i++) {
        let messageHash = ethers.utils.solidityKeccak256(['address', 'uint256'], [accounts[i+1].address, 0]);
        let messageBytes = ethers.utils.arrayify(messageHash);
        signatures.push(await owner.signMessage(messageBytes))
        
        if( i % 7 == 0 ) {
            console.log('----> INCREASE PRICE 0.007 <----')
            price = price + 0.007;
        }
        const overrides = { value: ethers.utils.parseEther(String(price))};

        let mint = await (await GMMerch.connect(accounts[i+1]).mintTokenAllow(0,signatures[i],overrides)).wait();
        console.log(`MINT TOKEN: #${i+1} ---- PRICE: ${price} - `, mint.transactionHash)
    }
    for (let i = 1; i <= 250; i++) {
      
      const overrides = { value: ethers.utils.parseEther(String(0.1))};
      let mint = await (await GMMerch.connect(accounts[i]).mintToken(2,overrides)).wait();
      console.log(`MINT TOKEN: #${i} ---- PRICE: ${price} - `, mint.transactionHash)
  }

    console.log('----------------------');
    console.log('----------------------');
    console.log('MERCH PASSESS MINTED:', (await GMMerch.merch(0)).minted)
    console.log('MINT PASSESS MINTED:', (await GMMerch.merch(1)).minted)
    console.log('MERCH PASSESS SUPPPLY:', (await GMMerch.merch(0)).supply)
    console.log('MINT PASSESS SUPPPLY:', (await GMMerch.merch(1)).supply)
    console.log('----------------------');
    console.log('----------------------');
    let adminMint = await GMMerch.connect(owner).mintAdmin(owner.address, 1, 20)
    await adminMint.wait()

    let adminMerchBundle = await GMMerch.balanceOf(owner.address,0)
    let AdminMintPass = await GMMerch.balanceOf(owner.address,1)
    console.log('ADMIN MERCH BUNDLE COUNT:', adminMerchBundle)
    console.log('ADMIN MINT PASS COUNT:', AdminMintPass)
    console.log('MERCH PASSESS MINTED:', (await GMMerch.merch(0)).minted)
    console.log('MINT PASSESS MINTED:', (await GMMerch.merch(1)).minted)
    console.log('----------------------');
    console.log('----------------------');
    
    // WITHDRAW 
    // - check balance before
    // - check balance after
    let shopBal = await hre.ethers.provider.getBalance(GMMerch.address);
    console.log('CONTRACT BALANCE/ ', ethers.utils.formatEther(shopBal) );
    let ownerBal = await hre.ethers.provider.getBalance(owner.address);
    console.log('OWNER BALANCE/ ', ethers.utils.formatEther(ownerBal) );
    console.log('================');
    console.log('WITHDRAW');
    console.log('================');
    let wd = await GMMerch.connect(owner).withdraw();
    let newShopBal = await hre.ethers.provider.getBalance(GMMerch.address);
    let newOwnerBal = await hre.ethers.provider.getBalance(owner.address);
    console.log('SHOP BALANCE/ ', ethers.utils.formatEther(newShopBal) );
    console.log('OWNER BALANCE/ ', ethers.utils.formatEther(newOwnerBal) );
    wd.wait();

    let setSHOP = await GMPFP.setMerchAddress(GMMerch.address);
    setSHOP.wait();
    //

    async function mintWithPass(account){
      let approval = await GMMerch.connect(account).setApprovalForAll(GMPFP.address, true);
      approval.wait();
      let mint = await (await GMPFP.connect(account).mintWithPass()).wait();
      console.log('PASS MINT: %s', mint.transactionHash)
    }
    async function mintWithBooster(account){
      let approval = await GMMerch.connect(account).setApprovalForAll(GMPFP.address, true);
      approval.wait();
      let mint = await (await GMPFP.connect(account).mintWithBoosterPack()).wait();
      console.log('PASS MINT: %s', mint.transactionHash)
    }

    async function mintAllow(i, _amount) {
      let overrides = { value: ethers.utils.parseEther(String(0.077*_amount))};
      let messageHash = ethers.utils.solidityKeccak256(['address'], [accounts[i].address]);
      let messageBytes = ethers.utils.arrayify(messageHash);
      pfpSignatures.push(await owner.signMessage(messageBytes))
      let mint = await (await GMPFP.connect(accounts[i]).mintAllow(_amount, pfpSignatures[i],overrides)).wait();
      console.log('>>%s %s', mint.transactionHash)
    }

    async function mintPublic(_amount) {
      let overrides = { value: ethers.utils.parseEther(String(0.077*_amount))};
      console.log(overrides, _amount)
      let mint = await GMPFP.connect(rAccount()).mint(_amount,overrides);
      const tx = await mint.wait();
      console.log('---- %s', tx.transactionHash)
    }

    const rNum = (min,max) => {
      const r = Math.floor(Math.random() * max) 
      if (r > min) {
        return r;
      } else  {
        return min;
      }

  }

    // OPEN -
    GMPFP.connect(owner).flipPassState();
    GMPFP.connect(owner).flipAllowState();
    GMPFP.connect(owner).flipPublicState();
    GMPFP.connect(owner).flipBoosterState();

    GMPFP.connect(owner).genStartingIndex();
    
    const rPass = rNum(250,250)
    console.log('MINT PASS: ', rPass)
    const rAllow = rNum(3500,3500)
    console.log('MINT PASS: ', rAllow)
    const rPublic  = rNum(200,200)
    console.log('PUBLIC PASS: ', rPublic)
    const rBooster = rNum(250,250)
    console.log('BOOSYER PASS: ', rBooster)

    // MINT - PASS
    for (let i = 1; i <= rPass; i++) {
      await mintWithPass(accounts[i])
    }

    // MINT - ALLOW
    for (let i = 1; i <= rAllow; i++) {
      await mintAllow(i, 2) 
    }
    // // MINT - PASS
    // for (let i = 1; i <= rPass/2; i++) {
    //   await mintWithPass(accounts[i])
    // }
    // // MINT - ALLOW
    // for (let i = rAllow; i <= rAllow/2; i++) {
    //   await mintAllow(i, 2) 
    // }

    // MINT - PUBLIC
    for (let i = 1; i <= rPublic; i++) {
      await mintPublic(10)
    }

    // MINT - PASS
    for (let i = 1; i <= rBooster; i++) {
      await mintWithBooster(accounts[i])
    }
    
    console.log('MINT PASS: ', rPass)
    console.log('MINT PASS: ', rAllow)
    console.log('PUBLIC PASS: ', rPublic)
    console.log('BOOSYER PASS: ', rBooster)
    console.log('TOTAL: ', await GMPFP.connect(owner).totalSupply())


    // WITHDRAW 
    // - check balance before
    // - check balance after
    let PfpBal = await hre.ethers.provider.getBalance(GMPFP.address);
    console.log('PFP BALANCE/ ', ethers.utils.formatEther(PfpBal) );
    ownerBal = await hre.ethers.provider.getBalance(owner.address);
    console.log('OWNER BALANCE/ ', ethers.utils.formatEther(ownerBal) );
    console.log('================');
    console.log('WITHDRAW');
    console.log('================');
    wd = await GMPFP.connect(owner).withdraw();
    wd.wait();
    let newPfpBal = await hre.ethers.provider.getBalance(GMPFP.address);
    newOwnerBal = await hre.ethers.provider.getBalance(owner.address);
    console.log('PFP BALANCE/ ', ethers.utils.formatEther(newPfpBal) );
    console.log('OWNER BALANCE/ ', ethers.utils.formatEther(newOwnerBal) );
    

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