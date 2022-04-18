require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      accounts: {
        count: 10000
      },
      // accounts: [
        // { privateKey: process.env.PRIVATE_KEY_MONKEY_PROD, balance: '10000000000000000000000'},
        // { privateKey: process.env.PRIVATE_KEY_DEV6, balance: '10000000000000000000000'}
      // ],
    },
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY_DEV6],
    },
    // mainnet: {      
    //   url: process.env.MAINNET_ALCHEMY_KEY,      
    //   accounts: [process.env.PRIVATE_KEY_MONKEY_PROD], 
    // },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API,
  }
};
