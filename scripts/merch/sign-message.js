require('dotenv').config();

const main = async () => {

let privateKey = process.env.PRIVATE_KEY;
let wallet = new ethers.Wallet(privateKey);
const message = `
    Message: SAM - UK

    Wallet address:
        ${wallet.address}
`
const signedMessage =  await wallet.signMessage(message);

// Backend code
  const signerAddress = ethers.utils.verifyMessage(message, signedMessage);
  const addressFromMessage = message.replace(/\n|\r/g, "").split("Wallet address:").pop().trim()
  console.log(signerAddress)
  console.log(addressFromMessage)
  // check burner
  console.log('Check BURNER is : ',addressFromMessage)

  if(signerAddress === addressFromMessage){
    // this means that the message was not signed
    console.log('match')
  } else {
    console.log('no match')
  }
}

  
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




