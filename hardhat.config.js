require("@nomicfoundation/hardhat-toolbox");

// const { vars } = require("hardhat/config");

// const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
// const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");

require("dotenv").config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
if (!ALCHEMY_API_KEY || !SEPOLIA_PRIVATE_KEY) {
  throw new Error("Please set your ALCHEMY_API_KEY and SEPOLIA_PRIVATE_KEY in a .env file");
}

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};
