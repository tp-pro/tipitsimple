require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.26",
    networks: {
        amoy: {
          url: process.env.LOCAL_HARDHAT,
          accounts: [process.env.LOCAL_HARDHAT_PRIVATE_KEY],
        }
    }
};
