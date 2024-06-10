// require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");


module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};
// module.exports = {
//   solidity: "0.8.0",
//   networks: {
//     hardhat: {},
//     localhost: {
//       url: "http://localhost:3000"  
//     }
//   }
// };
