require('dotenv').config();

const main = async () => {

let privateKey = process.env.PRIVATE_KEY;
let wallet = new ethers.Wallet(privateKey);

let messageHash = ethers.utils.solidityKeccak256(['address', 'uint256'], ['0xA1C3B5B509Be2Cb2090cC290098059948D97Fcba', 0]);
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