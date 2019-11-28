const { tbl_users, tbl_account_details, tbl_master_rooms, tbl_master_creators, tbl_contacts } = require('../models')
const { compare, hash } = require('../helpers/bcrypt')
const { sign, verify } = require('../helpers/jwt')
const { mailOptions, transporter } = require('../helpers/nodemailer')
const logError = require('../helpers/logError')

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
        let error = {
          uri: 'http://api.polagroup.co.id/users/signup',
          method: 'post',
          status: 500,
          message: err,
        }
        logError(error)
        res.status(500).json({ err })
      })
  }

  static signin(req, res) {
    let roomMaster, creatorMaster, statusCreatorMaster, statusRoomMaster, creatorAssistant, statusCreatorAssistant, detailUser, MyContactUs
    tbl_users.findOne({ where: { username: req.body.username } })
      .then(async userFound => {
        if (userFound) {
          if (compare(req.body.password, userFound.password)) {
            let token = sign({ user_id: userFound.user_id })

            detailUser = await tbl_account_details.findOne({ where: { user_id: userFound.user_id } })
            roomMaster = await tbl_master_rooms.findOne({ where: { user_id: userFound.user_id, chief: 1 } })
            creatorMaster = await tbl_master_creators.findOne({ where: { user_id: userFound.user_id, chief: 1 } })
            creatorAssistant = await tbl_master_creators.findOne({ where: { user_id: userFound.user_id, chief: { [Op.ne]: 1 } } })
            MyContactUs = await tbl_contacts.findAll({
              where: {
                user_id: userFound.user_id, status: 'confirmation', done_expired_date: { [Op.lte]: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` }
              }
            })

            roomMaster ? statusRoomMaster = true : statusRoomMaster = false
            creatorMaster ? statusCreatorMaster = true : statusCreatorMaster = false
            creatorAssistant ? statusCreatorAssistant = true : statusCreatorAssistant = false

            res.status(200).json({
              message: "Success",
              token,
              username: userFound.username,
              user_id: userFound.user_id,
              role_id: userFound.role_id,
              status: userFound.flag_password,
              position: detailUser.position_id,
              sisaCuti: detailUser.leave,
              isRoomMaster: statusRoomMaster,
              isCreatorMaster: statusCreatorMaster,
              isCreatorAssistant: statusCreatorAssistant,
              adminContactCategori: detailUser.admin_contact_categori,
            })

            MyContactUs && MyContactUs.forEach(async element => {
              await tbl_contacts.update({ status: 'done' }, { where: { contact_id: element.contact_id } })
            });
          } else {
            let error = {
              uri: 'http://api.polagroup.co.id/users/signin',
              method: 'post',
              status: 400,
              message: 'Username/password invalid',
            }
            logError(error)
            res.status(400).json({ msg: "Username/password invalid" })
          }
        } else {
          let error = {
            uri: 'http://api.polagroup.co.id/users/signin',
            method: 'post',
            status: 400,
            message: 'Username/password invalid',
          }
          logError(error)
          res.status(400).json({ msg: "Username/password invalid" })
        }
      })
      .catch(err => {
        console.log(err)
        let error = {
          uri: 'http://api.polagroup.co.id/users/signin',
          method: 'post',
          status: 500,
          message: err,
        }
        logError(error)
        res.status(500).json(err)
      })
  }

  static async findAll(req, res) {
    let detailAccount = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
    tbl_users.findAll({
      include: [{
        model: tbl_account_details,
        // where: { company_id: detailAccount.company_id },
      }]
    })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: 'http://api.polagroup.co.id/users',
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id,
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static async firstLogin(req, res) {
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
        let error = {
          uri: 'http://api.polagroup.co.id/users/changePassword',
          method: 'put',
          status: 500,
          message: err,
          user_id: req.user.user_id,
        }
        logError(error)
        res.status(500).json({ err })
      }
    } else {
      let error = {
        uri: 'http://api.polagroup.co.id/users/changePassword',
        method: 'put',
        status: 400,
        message: err,
        user_id: req.user.user_id,
      }
      logError(error)
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
        let error = {
          uri: `http://api.polagroup.co.id/users/${req.params.id}`,
          method: 'get',
          status: 500,
          message: err,
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static checktoken(req, res) {
    let roomMaster, creatorMaster, statusCreatorMaster, statusRoomMaster, creatorAssistant, statusCreatorAssistant, detailUser, MyContactUs
    let decoded = verify(req.headers.token);

    tbl_users.findByPk(Number(decoded.user_id))
      .then(async userFound => {
        if (userFound) {
          req.user = userFound
          detailUser = await tbl_account_details.findOne({ where: { user_id: decoded.user_id } })
          roomMaster = await tbl_master_rooms.findOne({ where: { user_id: decoded.user_id, chief: 1 } })
          creatorMaster = await tbl_master_creators.findOne({ where: { user_id: decoded.user_id, chief: 1 } })
          creatorAssistant = await tbl_master_creators.findOne({ where: { user_id: decoded.user_id, chief: { [Op.ne]: 1 } } })
          MyContactUs = await tbl_contacts.findAll({
            where: {
              user_id: userFound.user_id, status: 'confirmation', done_expired_date: { [Op.lte]: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` }
            }
          })

          // Admin Booking Room
          roomMaster ? statusRoomMaster = true : statusRoomMaster = false
          creatorMaster ? statusCreatorMaster = true : statusCreatorMaster = false
          creatorAssistant ? statusCreatorAssistant = true : statusCreatorAssistant = false

          res.status(200).json({
            status: 'Oke',
            username: userFound.username,
            user_id: userFound.user_id,
            role_id: userFound.role_id,
            isRoomMaster: statusRoomMaster,
            isCreatorMaster: statusCreatorMaster,
            isCreatorAssistant: statusCreatorAssistant,
            position: detailUser.position_id,
            sisaCuti: detailUser.leave,
            adminContactCategori: detailUser.admin_contact_categori,
          })

          MyContactUs && MyContactUs.forEach(async element => {
            await tbl_contacts.update({ status: 'done' }, { where: { contact_id: element.contact_id } })
          });
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
        let error = {
          uri: 'http://api.polagroup.co.id/users/activationAccount',
          method: 'put',
          status: 500,
          message: err,
          user_id: req.user.user_id,
        }
        logError(error)
        res.status(500).json({ err })
      }
    } else {
      let error = {
        uri: 'http://api.polagroup.co.id/users/activationAccount',
        method: 'put',
        status: 400,
        message: 'Username/password invalid',
      }
      logError(error)
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
      let error = {
        uri: 'http://api.polagroup.co.id/users/editProfil',
        method: 'put',
        status: 500,
        message: err,
        user_id: req.user.user_id,
      }
      logError(error)
      res.status(500).json({ err })
    }
  }

  static changeAvatar(req, res) {
    tbl_account_details.update({ avatar: `http://api.polagroup.co.id/${req.file.path}` }, {
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
        let error = {
          uri: 'http://api.polagroup.co.id/users/changeAvatar',
          method: 'put',
          status: 500,
          message: err,
          user_id: req.user.user_id,
        }
        logError(error)
        res.status(500).json({ err })
      })
  }

  static async forgetPassword(req, res) {
    // let username = await tbl_users.findOne({ where: { username: req.body.username } })

    // if (username) {
    //   newData = {
    //     password: hash(req.body.passwordBaru),
    //   }
    //   try {
    //     await tbl_users.update(newData, {
    //       where: { user_id: username.user_id }
    //     })

    //     res.status(200).json({ message: "Success" })

    //   } catch (err) {
    //     res.status(500).json({ err })
    //   }
    // } else {
    //   res.status(400).json({ msg: "Username/password invalid" })
    // }

  }

}

// queue.process('email', function (job, done) {
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       return console.log(error);
//     } else {
//       done()
//     }
//   })
// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     let error = {
//       uri: `http://api.polagroup.co.id/events/approvalEvent/${req.params.id}`,
//       method: 'put',
//       status: 0,
//       message: `Send email to ${element.email} is error`,
//       user_id: req.user.user_id
//     }
//     logError(error)
//   }
// })
// })

module.exports = user
