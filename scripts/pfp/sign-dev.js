
require('dotenv').config();

const main = async () => {
  
  let dev7_address = '0x5c3b51C7D95D06427cc90d64dFb50D6e910c1CA7';
  let privateKey = process.env.PRIVATE_KEY_DEV6;
  let wallet = new ethers.Wallet(privateKey);
  
  let messageHash = ethers.utils.solidityKeccak256(['address'], [dev7_address]);
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