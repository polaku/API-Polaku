const { tbl_users, tbl_account_details, tbl_master_rooms, tbl_master_creators, tbl_contacts, tbl_buildings, tbl_companys, tbl_positions } = require('../models')
const { compare, hash } = require('../helpers/bcrypt')
const { sign, verify } = require('../helpers/jwt')
const { mailOptions, transporter } = require('../helpers/nodemailer')
const logError = require('../helpers/logError')
const excelToJson = require('convert-excel-to-json');

const Sequelize = require('sequelize')
const Op = Sequelize.Op;

class user {
  static async signup(req, res) {
    var tempNIK
    if (req.body.nik) tempNIK = req.body.nik

    // //nik, address, initial, date_of_birth
    let newUser = {
      username: req.body.username,
      password: hash(req.body.password),
      email: req.body.email,
      permission: "all",
      role_id: req.body.role || 3,
      activated: req.body.role || 1,
    }

    tbl_users.create(newUser)
      .then(async data => {

        let building = await tbl_buildings.findByPk(req.body.building_id)

        let newAccountDetail = {
          user_id: data.null,
          fullname: req.body.fullname,
          initial: req.body.initial,
          nik: req.body.nik,
          address: req.body.address,
          date_of_birth: req.body.dateOfBirth,
          leave: req.body.leave || 0,
          building_id: req.body.building_id,
          location_id: building.location_id,
          company_id: req.body.company_id,
          position_id: req.body.position_id,
          designations_id: req.body.designations_id,
          phone: req.body.phone,
          name_evaluator_1: req.body.name_evaluator_1,
          name_evaluator_2: req.body.name_evaluator_2,
        }

        if (String(req.body.nik).length < 5) {
          tempNIK = req.body.nik

          for (let i = String(req.body.nik).length; i < 5; i++) {
            tempNIK = `0${tempNIK}`
          }
        }
        newAccountDetail.nik = tempNIK


        // if (req.file) newAccountDetail.avatar = `http://api.polagroup.co.id/${req.file.path}`
        if (req.file) newAccountDetail.avatar = `http://165.22.110.159/${req.file.path}`

        let createAccountDetail = await tbl_account_details.create(newAccountDetail)

        let findNew = await tbl_users.findByPk(createAccountDetail.user_id, { include: [{ model: tbl_account_details }] })

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
    let roomMaster, creatorMaster, statusCreatorMaster, statusRoomMaster, creatorAssistant, statusCreatorAssistant, detailUser, MyContactUs, evaluator1, evaluator2
    tbl_users.findOne({ where: { activated: 1, username: req.body.username } })
      .then(async userFound => {
        if (userFound) {
          if (compare(req.body.password, userFound.password)) {
            let token = sign({ user_id: userFound.user_id })

            detailUser = await tbl_account_details.findOne({
              where: { user_id: userFound.user_id },
              include:
                [
                  { as: "idEvaluator1", model: tbl_users, include: [{ model: tbl_account_details }] },
                  { as: "idEvaluator2", model: tbl_users, include: [{ model: tbl_account_details }] }
                ]
            })
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

            detailUser.idEvaluator1 ? evaluator1 = { idEvaluator1: detailUser.idEvaluator1.user_id, name: detailUser.idEvaluator1.tbl_account_detail.fullname } : null
            detailUser.idEvaluator2 ? evaluator2 = { idEvaluator2: detailUser.idEvaluator2.user_id, name: detailUser.idEvaluator2.tbl_account_detail.fullname } : null

            let bawahan = await tbl_account_details.findAll({ where: { name_evaluator_1: userFound.user_id }, include: [{ model: tbl_companys }] })

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
              evaluator1,
              evaluator2,
              bawahan
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
      // where: { activated: 1, user_id: { [Op.ne]: 1 } },
      where: { user_id: { [Op.ne]: 1 } },
      order: [['user_id', 'ASC']],
      include: [{
        model: tbl_account_details,
        // where: { company_id: detailAccount.company_id },
        include: [{
          model: tbl_users, as: "idEvaluator1", include: [{ model: tbl_account_details }]
        }, {
          model: tbl_users, as: "idEvaluator2", include: [{ model: tbl_account_details }]
        }, {
          model: tbl_companys
        }]
      }]
    })
      .then(data => {
        res.status(200).json({ message: "Success", totalRecord: data.length, data })
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
          where: { user_id: req.user.user_id, activated: 1 }
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
      where: { activated: 1 },
      attributes: {
        exclude: ['password']
      },
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
    let roomMaster, creatorMaster, statusCreatorMaster, statusRoomMaster, creatorAssistant, statusCreatorAssistant, detailUser, MyContactUs, evaluator1 = null, evaluator2 = null
    let decoded = verify(req.headers.token);

    tbl_users.findByPk(Number(decoded.user_id), { where: { activated: 1 }, })
      .then(async userFound => {
        if (userFound) {
          req.user = userFound
          detailUser = await tbl_account_details.findOne({
            where: { user_id: userFound.user_id },
            include:
              [
                { as: "idEvaluator1", model: tbl_users, include: [{ model: tbl_account_details }] },
                { as: "idEvaluator2", model: tbl_users, include: [{ model: tbl_account_details }] }
              ]
          })
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

          detailUser.idEvaluator1 ? evaluator1 = { idEvaluator1: detailUser.idEvaluator1.user_id, name: detailUser.idEvaluator1.tbl_account_detail.fullname } : null
          detailUser.idEvaluator2 ? evaluator2 = { idEvaluator2: detailUser.idEvaluator2.user_id, name: detailUser.idEvaluator2.tbl_account_detail.fullname } : null

          let bawahan = await tbl_account_details.findAll({ where: { name_evaluator_1: userFound.user_id }, include: [{ model: tbl_companys }] })

          res.status(200).json({
            message: 'Oke',
            username: userFound.username,
            user_id: userFound.user_id,
            role_id: userFound.role_id,
            status: userFound.flag_password,
            isRoomMaster: statusRoomMaster,
            isCreatorMaster: statusCreatorMaster,
            isCreatorAssistant: statusCreatorAssistant,
            position: detailUser.position_id,
            sisaCuti: detailUser.leave,
            adminContactCategori: detailUser.admin_contact_categori,
            evaluator1,
            evaluator2,
            bawahan
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
          where: { user_id: req.user.user_id, activated: 1 }
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

  static async editUser(req, res) {
    let newData1, newData2

    newData1 = {
      username: req.body.username,
      email: req.body.email,
      activated: req.body.isActive
    }

    newData2 = {
      fullname: req.body.fullname,
      company_id: req.body.company_id,
      initial: req.body.initial,
      phone: req.body.phone,
      nik: req.body.nik,
      name_evaluator_1: req.body.evaluator1,
      name_evaluator_2: req.body.evaluator2,
    }

    try {
      await tbl_users.update(newData1, {
        where: { user_id: req.params.id }
      })
      await tbl_account_details.update(newData2, {
        where: { user_id: req.params.id }
      })

      let dataReturning = await tbl_users.findByPk(req.params.id, {
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
    // tbl_account_details.update({ avatar: `http://api.polagroup.co.id/${req.file.path}` }, {
    tbl_account_details.update({ avatar: `http://165.22.110.159/${req.file.path}` }, {
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

  static async importUser(req, res) {
    let result

    try {
      if (req.body.jenisImport === "cuti") {
        result = excelToJson({
          sourceFile: req.file.path,
          header: {
            rows: 1
          },
          columnToKey: {
            A: 'nik',
            B: 'leave'
          }
        })

        result.Sheet1.forEach(async el => {
          await tbl_account_details.update({ leave: el.leave }, { where: { nik: el.nik } })
        })
      } else if (req.body.jenisImport === "evaluator") {
        result = excelToJson({
          sourceFile: req.file.path,
          header: {
            rows: 1
          },
          columnToKey: {
            A: 'nik',
            B: 'evaluator_1',
            C: 'evaluator_2'
          }
        })

        let accountDetail = await tbl_account_details.findAll()

        result.Sheet1.forEach(async el => {
          let evaluator1 = await accountDetail.find(user => Number(user.nik) === Number(el.evaluator_1))
          let evaluator2 = await accountDetail.find(user => Number(user.nik) === Number(el.evaluator_2))

          let newData = {
            name_evaluator_1: evaluator1.user_id,
          }
          if (evaluator2) newData.name_evaluator_2 = evaluator2.user_id

          await tbl_account_details.update(newData, { where: { nik: el.nik } })
        })
      } else if (req.body.jenisImport === "addUser") {
        result = excelToJson({
          sourceFile: req.file.path,
          sheets: [{
            name: 'Sheet1',
            header: {
              rows: 1
            },
            columnToKey: {
              A: 'fullname',
              B: 'initial',
              C: 'nik',
              D: 'birth_date',
              E: 'alamat',
              F: 'no_telp',
              G: 'email',
              H: 'username',
              I: 'gedung',
              J: 'perusahaan',
              K: 'nik_evaluator_1',
              L: 'nik_evaluator_2',
              M: 'posisi',
              N: 'sisa_cuti',
              O: 'action'
            }
          }]
        })

        let building = await tbl_buildings.findAll()
        let accountDetail = await tbl_account_details.findAll()
        let company = await tbl_companys.findAll()
        let position = await tbl_positions.findAll()

        result.Sheet1.forEach(async el => {

          if (el.action === "CREATE") {
            let gedung = building.find(building => building.building === el.gedung)
            let evaluator1 = await accountDetail.find(user => Number(user.nik) === Number(el.nik_evaluator_1))
            let evaluator2 = await accountDetail.find(user => Number(user.nik) === Number(el.nik_evaluator_2))
            let perusahaan = company.find(pt => pt.company_name === el.perusahaan)
            let posisi = position.find(pos => pos.position === el.posisi)

            let dateBirth = new Date(el.birth_date).getDate()
            let monthBirth = new Date(el.birth_date).getMonth() + 1

            if (dateBirth < 10) {
              dateBirth = `0${dateBirth}`
            }
            if (monthBirth < 10) {
              monthBirth = `0${monthBirth}`
            }

            let newUser = {
              username: el.username,
              password: hash(`${dateBirth}${monthBirth}${new Date(el.birth_date).getFullYear()}`),
              email: el.email,
              permission: "all",
              role_id: 3,
              activated: 1,
            }

            tbl_users.create(newUser)
              .then(async data => {
                let newAccountDetail = {
                  user_id: data.null,
                  fullname: el.fullname,
                  initial: el.initial,
                  address: el.alamat,
                  date_of_birth: el.birth_date,
                  leave: el.sisa_cuti || 0,
                  building_id: gedung.building_id,
                  location_id: gedung.location_id,
                  company_id: perusahaan.company_id,
                  position_id: posisi.position_id,
                  phone: el.no_telp
                }

                if (gedung) {
                  newAccountDetail.building_id = gedung.building_id
                  newAccountDetail.location_id = gedung.location_id
                }

                if (evaluator1) newAccountDetail.name_evaluator_1 = evaluator1.user_id
                if (evaluator2) newAccountDetail.name_evaluator_2 = evaluator2.user_id

                let tempNIK
                if (String(el.nik).length < 5) {
                  tempNIK = el.nik
                  for (let i = String(el.nik).length; i < 5; i++) {
                    tempNIK = `0${tempNIK}`
                  }
                }
                newAccountDetail.nik = tempNIK

                let createAccountDetail = await tbl_account_details.create(newAccountDetail)
              })
          }

        })
      }
      res.status(200).json({ message: "Success" })
    } catch (err) {
      console.log(err)
      let error = {
        uri: 'http://api.polagroup.co.id/users/changeAvatar',
        method: 'put',
        status: 500,
        message: err,
        user_id: req.user.user_id,
      }
      logError(error)
      res.status(500).json({ err })
    }
  }

  static async normalitationNIK(req, res) {
    try {
      let allUsers = await tbl_account_details.findAll()

      allUsers.forEach(async user => {
        if (String(user.nik).length < 5 && user.user_id !== 1) {
          let tempNIK
          tempNIK = user.nik
          for (let i = String(user.nik).length; i < 5; i++) {
            tempNIK = `0${tempNIK}`
          }
          await tbl_account_details.update({ nik: tempNIK }, { where: { user_id: user.user_id } })
        }
      })
      res.status(200).json({ message: "Success" })
    } catch (err) {
      let error = {
        uri: 'http://api.polagroup.co.id/users/changeAvatar',
        method: 'put',
        status: 500,
        message: err,
        user_id: req.user.user_id,
      }
      logError(error)
      res.status(500).json({ err })
    }
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
