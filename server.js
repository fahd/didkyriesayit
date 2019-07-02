const express = require('express')
const fs = require('fs');
const https = require('https');
const path = require('path');
const bodyparser = require('body-parser');
const { json, urlencoded } = bodyparser;
const config = require('./server/config')
const cors = require('cors')
const connect = require('./server/utils/db')
const quoteRouter = require('./server/resources/quote/quote.router');
const app = express()

// const { signup, signin, protect } =require('./utils/auth')

app.disable('x-powered-by')
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }))

app.use(express.static((path.join(__dirname))))
app.use('/api/quotes', quoteRouter);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

console.log('here')

// Serve static home file
app.get('/',(req,res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, './index.html'));
});
// app.use('/api', protect)

const start = async () => {
  try {
    await connect()
    .then( () => {
      console.log('Connection to the Atlas Cluster is successful!')
    })
    .catch( (err) => console.error('mongodb error',err));
    
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
      },app).listen(config.port, () => {
      console.log(`Listening on port ${config.port}`)
    })
  } catch (e) {
    console.error(e)
  }
}

start()