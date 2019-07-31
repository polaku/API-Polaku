const { tbl_users } = require('../models')
const { verify } = require('../helpers/jwt')

function authentication(req, res, next) {
  let decoded = verify(req.headers.token);
  console.log(decoded);
  
  tbl_users.findOne({ where: { user_id: decoded.user_id } })
    .then(userFound => {
      if (userFound) {
        req.user = userFound
        next()
      } else {
        res.status(401).json({ message: 'Unauthorized1' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized2' })
    })

}

function authorization(req, res, next) {
  Cart.findOne({ _id: req.params.id })
    .then(data => {
      if (String(data.tbl_usersId) === String(req.tbl_usersId)) {
        next()
      } else {
        res.status(401).json({ message: 'Unauthorized' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized' })
    })
}

module.exports = { authentication, authorization }
