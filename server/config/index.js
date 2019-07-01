require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const { merge } = require('lodash');
const devConfig = require('./dev');
const prodConfig = require('./prod');

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port: env === 'production' ? process.env.PORT : 3001,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: '100d'
  }
}

let envConfig = {}

switch (env) {
  case 'production':
    envConfig = prodConfig;
    break;
  case 'development':
    envConfig = devConfig;
    break;
  default:
    envConfig = devConfig;
}

module.exports = merge(baseConfig, envConfig);
