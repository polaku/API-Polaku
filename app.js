require('dotenv').config()
const express = require('express')
const cors = require('cors')
const route = require('./routes')
const portServer = process.env.PORT_SERVER
const morgan = require('morgan')

let app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use('/asset/img', express.static('assets'));
app.use(morgan('dev'))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

app.use('/', route)

app.listen(portServer, () => {
  console.log(`Server listen on port ${portServer}`);
})

module.exports = app
