require("@nomicfoundation/hardhat-toolbox");

const TESTNET_AMOY_URL = process.env.TESTNET_AMOY_URL;
const PRIVATE_KEY_AMOY = process.env.PRIVATE_KEY_AMOY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.26",
    networks: {
        amoy: {
          url: TESTNET_AMOY_URL,
          accounts: [PRIVATE_KEY_AMOY],
        }
      }
};
