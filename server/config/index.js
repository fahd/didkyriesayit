const { merge } = require('lodash');
const env = process.env.NODE_ENV || 'development';
const devConfig = require('./dev');

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port: 3000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: '100d'
  }
}

let envConfig = {}

switch (env) {
  case 'dev':
  case 'development':
    envConfig = devConfig;
    break;
  // case 'test':
  // case 'testing':
  //   envConfig = require('./testing').config;
  //   break;
  default:
    envConfig = devConfig;
}

module.exports = merge(baseConfig, envConfig);
