require('dotenv').config();

const main = async () => {
    const [owner, r1,] = await hre.ethers.getSigners();

    const GMMerchFactory = await hre.ethers.getContractFactory('GMMerch');
    const GMMerch = await GMMerchFactory.deploy();
    await GMMerch.deployed();
    console.log("MERCH BUNDLE deployed to:", GMMerch.address);

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
          true,
          true,
          true );
    
    const add = '0xb698e12d581c197087a290cf8d21555931aadc85'
    const sig = '0x8a235bd6f3dff2891f1299b465d3bab2ab0903bb77b0c3afaac88480a9241c8a3b0aa24c7448a14f2f4bee5ccd7cd2457ad52d2804e4e052f47b02c4559da35d1c'
    const id = 0;
    const signer  = await GMMerch.recoverSigner(add, sig, id)
    
    console.log(signer);
    // let price = 0.07;
    // for (let i = 0; i < 77; i++) {
        // let messageHash = ethers.utils.solidityKeccak256(['address', 'uint256'], [r1.address, 0]);
        // let messageBytes = ethers.utils.arrayify(messageHash);
        // let sig = owner.signMessage(messageBytes)
        
        // // if( i % 7 == 0 ) {
        // //     console.log('----> INCREASE PRICE 0.007 <----')
        // //     price = price + 0.007;
        // // }



        // const contractPrice = ethers.utils.formatEther( (await GMMerch.merch(0)).price );
        // let sndVal = String(contractPrice);
        // const overrides = { value: ethers.utils.parseEther(sndVal)};

        // let mint = await (await GMMerch.connect(r1).mintTokenAllow(0,sig,overrides)).wait();
        // console.log(`MINT TOKEN: #${1} ---- PRICE: ${contractPrice} - `, mint.transactionHash)
    // }

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