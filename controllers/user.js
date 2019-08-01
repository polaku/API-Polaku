const { tbl_users } = require('../models')
const { compare, hash } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')

class userController {
  static signup(req, res) {
    let newData = {
      username: req.body.username,
      email: req.body.email,
      password: hash(req.body.password)
    }

    tbl_users.create(newData)
      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
      })
  }

  static signin(req, res) {
    tbl_users.findOne({ where: { username: req.body.username } })
      .then(userFound => {
        if (userFound) {
          if (compare(req.body.password, userFound.password)) {
            let token = sign({ user_id: userFound.user_id })
            res.status(200).json({ token, username: userFound.username })
          } else {
            res.status(400).json({ msg: "Bad request1" })
          }
        } else {
          res.status(400).json({ msg: "Bad request" })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static findAll(req, res) {
    tbl_users.findAll()
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static changePassword(req, res) {
    let newData

    newData ={
      password: hash(req.body.password)
    }

    tbl_users.update(newData, {
      where: { user_id: Number(req.params.id) }
    })
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => {
      res.status(500).json({ err })
      console.log(err);
    })
  }

}

module.exports = userController
