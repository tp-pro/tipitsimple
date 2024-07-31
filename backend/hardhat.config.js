require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.26",
    networks: {
        localhost: {
            url: process.env.LOCAL_HARDHAT || "http://127.0.0.1:8545",
            accounts: [process.env.LOCAL_HARDHAT_PRIVATE_KEY].filter(Boolean)
        },
        amoyTestnet: {
            url: process.env.TESTNET_AMOY_URL,
            accounts: [process.env.PRIVATE_KEY_AMOY].filter(Boolean)
        }
    },
};
