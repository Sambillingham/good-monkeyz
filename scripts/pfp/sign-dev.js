
require('dotenv').config();

const main = async () => {
  
  let dev5_address = '0xAd0FdA5A6B0D8eDdECc023619F060B08d761e867';
  let privateKey = process.env.PRIVATE_KEY_DEV4;
  let wallet = new ethers.Wallet(privateKey);
  
  let messageHash = ethers.utils.solidityKeccak256(['address'], [dev5_address]);
  let messageBytes = ethers.utils.arrayify(messageHash);
  let signature = await wallet.signMessage(messageBytes);
  
  console.log("Signature: ", signature);
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