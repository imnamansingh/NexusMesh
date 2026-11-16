import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: process.env.HARDHAT_NODE_URL,
      chainId: 31337,
    },
  },
};
