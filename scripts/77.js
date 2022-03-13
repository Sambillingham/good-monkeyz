require('dotenv').config();

const main = async () => {
    const accounts = await hre.ethers.getSigners();
    let signatures = [];
    const GMMerchFactory = await hre.ethers.getContractFactory('GMMerch');
    const GMMerch = await GMMerchFactory.deploy();
    await GMMerch.deployed();
    console.log("MERCH BUNDLE deployed to:", GMMerch.address);
    
    const owner = accounts[0];
    await GMMerch.connect(owner).createMerchItem(77, ethers.utils.parseEther('0.07'), ethers.utils.parseEther('0.007') )
    await GMMerch.connect(owner).createMerchItem(77, ethers.utils.parseEther('0.1'), ethers.utils.parseEther('0.001') )
    await GMMerch.connect(owner).updateMerchItem(
        0, 
        77,
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
    
    let price = 0.07;
    for (let i = 0; i < 77; i++) {
        let messageHash = ethers.utils.solidityKeccak256(['address', 'uint256'], [accounts[i+1].address, 0]);
        let messageBytes = ethers.utils.arrayify(messageHash);
        signatures.push(await owner.signMessage(messageBytes))
        
        if( i % 7 == 0 ) {
            console.log('----> INCREASE PRICE 0.007 <----')
            price = price + 0.007;
        }

        const contractPrice = ethers.utils.formatEther( (await GMMerch.merch(0)).price );
        let sndVal = String(price);
        const overrides = { value: ethers.utils.parseEther(sndVal)};

        let mint = await (await GMMerch.connect(accounts[i+1]).mintTokenAllow(0,signatures[i],overrides)).wait();
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