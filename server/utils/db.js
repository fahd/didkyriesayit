const mongoose = require('mongoose');
const options = require('../config');

const connect = (uri = options.dbUrl, opts = {}) => {
  console.log('options',options);
  return mongoose.connect(
    uri,
    { dbName: options.dbName, useNewUrlParser: true }
  )
}

module.exports = connect;