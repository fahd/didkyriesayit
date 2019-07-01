const dbUrl = 'mongodb://localhost:27017/kyrie';

const config = {
  secrets: {
    jwt: 'kyrieswerving'
  },
  dbUrl
}

module.exports = config;