const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();

    const GMShopFactory = await hre.ethers.getContractFactory('GMShop');
    const GMShop = await GMShopFactory.deploy();
    await GMShop.deployed();
    console.log("SHOP deployed to:", GMShop.address);

    const GMPFPFactory = await hre.ethers.getContractFactory('GMPFP');
    const GMPFP = await GMPFPFactory.deploy();
    await GMPFP.deployed();
    console.log("PFP deployed to:", GMPFP.address);

    const overrides = { value: ethers.utils.parseEther('0.001')};
    let txn = await GMShop.connect(randomPerson).mint(2, overrides);
    txn.wait();
    let txn2 = await GMShop.connect(randomPerson).mint(2, overrides);
    txn2.wait();
    let setSHOP = await GMPFP.setShopAddress(GMShop.address);
    setSHOP.wait();

    let approval = await GMShop.connect(randomPerson).setApprovalForAll(GMPFP.address, true);
    approval.wait();
    
    let mint = await GMPFP.connect(randomPerson).mintWithPass5();
    mint.wait();
    let mint2 = await GMPFP.connect(randomPerson).mintWithPass5();
    mint2.wait();

    let supply = await GMShop.getMinted();

    console.log( 'Supply %s', supply )
  
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