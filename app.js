require('dotenv').config()
const express = require('express')
const cors = require('cors')
const route = require('./routes')
// const kue = require('kue')
const portServer = process.env.PORT_SERVER
// const portKue = process.env.PORT_KUE
const morgan = require('morgan')

let app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(express.static('./uploads'))

app.use(morgan('dev'))
app.use('/', route)

app.listen(portServer, () => {
  console.log(`Server listen on port ${portServer}`);
})

// kue.app.listen(portKue, ()=>{
//   console.log(`Kue listen on port ${portKue}`);
// })

module.exports = app
