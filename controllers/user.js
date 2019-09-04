const { tbl_users, tbl_account_details } = require('../models')
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
        res.status(201).json({ message: "Success", data })
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
            res.status(200).json({ message: "Success", token, username: userFound.username, user_id: userFound.user_id })
          } else {
            res.status(400).json({ msg: "Username/password invalid" })
          }
        } else {
          res.status(400).json({ msg: "Username/password invalid" })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static findAll(req, res) {
    tbl_users.findAll()
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static changePassword(req, res) {
    let newData

    newData = {
      password: hash(req.body.password)
    }

    tbl_users.update(newData, {
      where: { user_id: Number(req.user.user_id) }
    })
      .then(async () => {
        let dataReturning = await tbl_users.findByPk(req.user.user_id)

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_users.findByPk(req.params.id, {
      include: [{
        model: tbl_account_details,
      }]
    })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

}

module.exports = userController
