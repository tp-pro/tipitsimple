require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

console.log(process.env.LOCAL_HARDHAT);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.26",
    networks: {
        localhost: {
            url: process.env.LOCAL_HARDHAT,
            accounts: [process.env.LOCAL_HARDHAT_PRIVATE_KEY]
        },
        amoyTestnet: {
            url: process.env.TESTNET_AMOY_URL,
            accounts: [process.env.PRIVATE_KEY_AMOY]
        }
    },
};
