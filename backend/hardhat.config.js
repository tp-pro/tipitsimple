require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

console.log(process.env.LOCAL_HARDHAT);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.26",
    networks: {
        localhost: {
            url: process.env.LOCAL_HARDHAT,
            chainId: 31337
        },
        amoyTestnet: {
            url: process.env.TESTNET_AMOY_URL,
            accounts: [process.env.PRIVATE_KEY_AMOY]
        }
    },
};
