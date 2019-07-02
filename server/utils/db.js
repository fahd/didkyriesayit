const mongoose = require('mongoose');
const options = require('../config');

const connect = (url = options.dbUrl, opts = {}) => {
  console.log('mongoose url',url)
  return mongoose.connect(
    url,
    { ...opts, useNewUrlParser: true }
  )
}

module.exports = connect;