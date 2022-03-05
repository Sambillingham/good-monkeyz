require('dotenv').config();

const main = async () => {
    const [owner, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13,r14, r15, r16, r17, r18, r19] = await hre.ethers.getSigners();

    const GMMerchBundleFactory = await hre.ethers.getContractFactory('GMMerchStrut');
    const GMMerchBundle = await GMMerchBundleFactory.deploy();
    await GMMerchBundle.deployed();
    console.log("MERCH BUNDLE deployed to:", GMMerchBundle.address);

    await GMMerchBundle.connect(owner).createMerchItem(77, ethers.utils.parseEther('0.07'), ethers.utils.parseEther('0.001') )
    await GMMerchBundle.connect(owner).createMerchItem(77, ethers.utils.parseEther('0.1'), ethers.utils.parseEther('0.001') )
    await GMMerchBundle.connect(owner).updateMerchItem(
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


          // let messageHash = ethers.utils.id(owner.address);
          let messageHash = ethers.utils.solidityKeccak256(['address', 'uint256'], [owner.address, 0]);
          let messageBytes = ethers.utils.arrayify(messageHash);
          let signature = await owner.signMessage(messageBytes);
          console.log("Signature: ", signature);

          // const overrides = { value: ethers.utils.parseEther('0.2')};
          // let mint = await (await GMMerchBundle.connect(r1).mintTokenAllow(0, signature, overrides)).wait();
          // console.log('tx', mint.transactionHash)

          // solidityKeccak256
    // let mHash = ethers.utils.id(r1.address);
    // let bytes = ethers.utils.arrayify(mHash);
    // let signature = await owner.signMessage(bytes);
    // console.log(signature)
    // let addressHash2 = ethers.utils.id(r2.address);
    // let bytes2 = ethers.utils.arrayify(addressHash2);
    // let signature2 = await r3.signMessage(bytes2);
    // console.log('SIG: ', signature)

    // const overrides = { value: ethers.utils.parseEther('0.2')};
    // let mint = await (await GMMerchBundle.connect(owner).mintTokenAllow(0, signature, overrides)).wait();
    // let mint3 = await (await GMMerchBundle.connect(r1).mintTokenAllow(0, addressHash, '0xfe7047b678c0a36323e9723baabe7038a4013986a5d655745fb023ff1e9b81cf5cac95e83bad546ef01492f7730694584ce4d434fa245b298bf51a8ca4f453e11c', overrides)).wait();
    // let mint2 = await (await GMMerchBundle.connect(r2).mintTokenAllow(0, addressHash2, signature2 , overrides)).wait();
    // console.log(mint.transactionHash)
    // console.log(mint2.transactionHash)
    // console.log(mint3.transactionHash)

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