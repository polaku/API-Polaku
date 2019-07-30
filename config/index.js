const mysql = require('mysql')

const dbConn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Testing123.',
  database: 'dumy_polagroup'
})

module.exports = { dbConn }
