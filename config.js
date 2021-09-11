/**
 * Creates and exports environment configuration
 *
 */

//container containing all the environments
const environments = {};

//Stagging (Default) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
};

//Production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
};

//Determine which environment was pass to the command-line as argument
const currentEnv =
  typeof process.env.NODE_ENV == "string" ? process.env.NODE_ENV : "";

//Check if the environment specified of the environment above if not default to staging

const envToExport =
  typeof environments[currentEnv] == "object"
    ? environments[currentEnv]
    : environments.staging;

//export the module for us in index.js
module.exports = envToExport;
