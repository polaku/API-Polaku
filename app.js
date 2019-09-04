require('dotenv').config()
const express = require('express')
const cors = require('cors')
const route = require('./routes')
const port = process.env.PORT

let app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(express.static('./uploads'))

app.use('/', route)

app.listen(port, () => {
  console.log(`Server listen on ${port}`);
})

module.exports = app
