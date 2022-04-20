
require('dotenv').config();

const main = async () => {
  
  let dev7_address = '0xd3d7db39e933A86D15A135a8Cc8dd8E14Ed6C616';
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