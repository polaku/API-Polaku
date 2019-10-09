const { tbl_users, tbl_account_details, tbl_master_rooms, tbl_master_creators } = require('../models')
const { compare, hash } = require('../helpers/bcrypt')
const { sign, verify } = require('../helpers/jwt')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

class user {
  static signup(req, res) {
    let newData = {
      username: req.body.username,
      email: req.body.email,
      password: hash(req.body.password)
    }

    tbl_users.create(newData)
      .then(async data => {
        let findNew = await tbl_users.findByPk(data.null)
        res.status(201).json({ message: "Success", data: findNew })
      })
      .catch(err => {
        res.status(500).json({ err })
      })
  }

  static signin(req, res) {
    tbl_users.findOne({ where: { username: req.body.username } })
      .then(async userFound => {
        if (userFound) {
          if (compare(req.body.password, userFound.password)) {
            let token = sign({ user_id: userFound.user_id })
            res.status(200).json({ message: "Success", token, username: userFound.username, user_id: userFound.user_id, status: userFound.flag_password })
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
    tbl_users.findAll({
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

  static async changePassword(req, res) {
    let newData

    if (compare(req.body.passwordLama, req.user.password)) {

      newData = {
        password: hash(req.body.passwordBaru),
      }
      try {
        await tbl_users.update(newData, {
          where: { user_id: req.user.user_id }
        })
        await tbl_account_details.update({ phone: req.body.noHP }, {
          where: { user_id: req.user.user_id }
        })

        let dataReturning = await tbl_users.findByPk(req.user.user_id)

        res.status(200).json({ message: "Success", data: dataReturning })

      } catch (err) {
        res.status(500).json({ err })
      }
    } else {
      res.status(400).json({ msg: "Username/password invalid" })
    }

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

  static checktoken(req, res) {
    let roomMaster, creatorMaster, statusCreatorMaster, statusRoomMaster, creatorAssistant, statusCreatorAssistant
    let decoded = verify(req.headers.token);
    console.log(decoded.user_id)
    tbl_users.findByPk(Number(decoded.user_id))
      .then(async userFound => {
        if (userFound) {
          req.user = userFound
          roomMaster = await tbl_master_rooms.findOne({ where: { user_id: decoded.user_id, chief: 1 } })
          creatorMaster = await tbl_master_creators.findOne({ where: { user_id: decoded.user_id, chief: 1 } })
          creatorAssistant = await tbl_master_creators.findOne({ where: { user_id: decoded.user_id, chief: { [Op.ne]: 1 } } })


          console.log(roomMaster)
          roomMaster ? statusRoomMaster = true : statusRoomMaster = false
          creatorMaster ? statusCreatorMaster = true : statusCreatorMaster = false
          creatorAssistant ? statusCreatorAssistant = true : statusCreatorAssistant = false

          res.status(200).json({ status: 'Oke', user_id: userFound.user_id, role_id: userFound.role_id, isRoomMaster: statusRoomMaster, isCreatorMaster: statusCreatorMaster, isCreatorAssistant: statusCreatorAssistant })
        } else {
          res.status(401).json({ status: 'Token expired1' })
        }
      })
      .catch(err => {
        console.log(err)
        res.status(401).json({ status: 'Token expired2' })
      })
  }

  static async activationAccount(req, res) {
    let newData

    if (compare(req.body.passwordLama, req.user.password)) {
      newData = {
        password: hash(req.body.passwordBaru),
        email: req.body.email,
        flag_password: 1,
      }
      try {
        await tbl_users.update(newData, {
          where: { user_id: req.user.user_id }
        })
        await tbl_account_details.update({ phone: req.body.noHP }, {
          where: { user_id: req.user.user_id }
        })

        let dataReturning = await tbl_users.findByPk(req.user.user_id)

        res.status(200).json({ message: "Success", data: dataReturning })

      } catch (err) {
        res.status(500).json({ err })
      }
    } else {
      res.status(400).json({ msg: "Username/password invalid" })
    }
  }

  static async editProfil(req, res) {
    let newData1, newData2

    newData1 = {
      username: req.body.username,
      email: req.body.email,
    }

    newData2 = {
      fullname: req.body.fullname,
      phone: req.body.phone,
    }

    try {
      await tbl_users.update(newData1, {
        where: { user_id: req.user.user_id }
      })
      await tbl_account_details.update(newData2, {
        where: { user_id: req.user.user_id }
      })

      let dataReturning = await tbl_users.findByPk(req.user.user_id, {
        include: [{
          model: tbl_account_details,
        }]
      })

      res.status(200).json({ message: "Success", data: dataReturning })

    } catch (err) {
      res.status(500).json({ err })
    }
  }

  static changeAvatar(req, res) {
    tbl_account_details.update({ avatar: req.file.path }, {
      where: { user_id: req.user.user_id }
    })
      .then(async () => {
        let dataReturning = await tbl_users.findByPk(req.user.user_id, {
          include: [{
            model: tbl_account_details,
          }]
        })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        res.status(500).json({ err })
      })
  }

}

module.exports = user
