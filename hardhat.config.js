require("@nomicfoundation/hardhat-toolbox")
require("hardhat-contract-sizer")
require("./tasks")
const { networks } = require("./networks")
const { SecretsManager } = require("@chainlink/functions-toolkit")

// Enable gas reporting (optional)
const REPORT_GAS = process.env.REPORT_GAS?.toLowerCase() === "true" ? true : false

const SOLC_SETTINGS = {
  optimizer: {
    enabled: true,
    runs: 1_000,
  },
}

console.log("Environment variables loaded:", {
  SOUNDCHART_APP_ID: !!process.env.SOUNDCHART_APP_ID,
  SOUNDCHART_API_KEY: !!process.env.SOUNDCHART_API_KEY,
  TWILIO_API_KEY: !!process.env.TWILIO_API_KEY,
})

// Add this debugging section
console.log("Environment variable names present:", {
  SOUNDCHART_APP_ID: process.env.hasOwnProperty("SOUNDCHART_APP_ID"),
  SOUNDCHARTS_API_KEY: process.env.hasOwnProperty("SOUNDCHARTS_API_KEY"), // Note the 'S'
  TWILIO_API_KEY: process.env.hasOwnProperty("TWILIO_API_KEY"),
})

console.log("Secret lengths:", {
  soundchartAppId: String(process.env.SOUNDCHART_APP_ID || "").length,
  soundchartApiKey: String(process.env.SOUNDCHARTS_API_KEY || "").length, // Note the 'S'
  twilioApiKey: String(process.env.TWILIO_API_KEY || "").length,
})

/** @type import('hardhat/config').HardhatUserConfig */
const requestConfig = {
  defaultNetwork: "localFunctionsTestnet",
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.8.7",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.7.0",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.6.6",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.4.24",
        settings: SOLC_SETTINGS,
      },
    ],
  },
  networks: {
    ...networks,
    hardhat: {
      accounts: process.env.PRIVATE_KEY
        ? [
            {
              privateKey: process.env.PRIVATE_KEY,
              balance: "10000000000000000000000",
            },
            {
              privateKey: process.env.SECOND_PRIVATE_KEY,
              balance: "10000000000000000000000",
            },
          ]
        : [],
    },
  },
  etherscan: {
    apiKey: {
      mainnet: networks.ethereum.verifyApiKey,
      avalanche: networks.avalanche.verifyApiKey,
      polygon: networks.polygon.verifyApiKey,
      sepolia: networks.ethereumSepolia.verifyApiKey,
      polygonMumbai: networks.polygonMumbai.verifyApiKey,
      avalancheFujiTestnet: networks.avalancheFuji.verifyApiKey,
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  contractSizer: {
    runOnCompile: false,
    only: ["FunctionsConsumer", "AutomatedFunctionsConsumer", "FunctionsBillingRegistry"],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
  secrets: {
    soundchartAppId: String(process.env.SOUNDCHART_APP_ID || ""),
    soundchartApiKey: String(process.env.SOUNDCHART_API_KEY || ""),
    twilioApiKey: String(process.env.TWILIO_API_KEY || ""),
  },
}

// Add this before module.exports to validate secrets
// This will help us debug the issue
console.log("Checking secrets:")
console.log("Keys present:", Object.keys(requestConfig.secrets))
console.log(
  "Values are strings:",
  Object.values(requestConfig.secrets).every((v) => typeof v === "string")
)
console.log(
  "Values are non-empty:",
  Object.values(requestConfig.secrets).every((v) => v.length > 0)
)

module.exports = requestConfig
