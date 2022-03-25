require('dotenv').config();

const main = async () => {

let privateKey = process.env.PRIVATE_KEY_MONKEY_PROD;
let owner = new ethers.Wallet(privateKey);

let messageHash = ethers.utils.solidityKeccak256(['address', 'uint256'], ['0x9727938aa47822147a4acd534b088634cb23a4a8', 0]);
let messageBytes = ethers.utils.arrayify(messageHash);
let signature = await owner.signMessage(messageBytes);
console.log(signature);

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