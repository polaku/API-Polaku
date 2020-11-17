const { tbl_users, tbl_account_details, tbl_master_rooms, tbl_master_creators, tbl_contacts, tbl_buildings, tbl_companys, tbl_positions, tbl_dinas, tbl_departments, tbl_designations, tbl_user_roles, tbl_log_employees, tbl_PICs } = require('../models')
const { compare, hash } = require('../helpers/bcrypt')
const { sign, verify } = require('../helpers/jwt')
const { mailOptions, transporter } = require('../helpers/nodemailer')
const logError = require('../helpers/logError')
const excelToJson = require('convert-excel-to-json');
const { createDateAsUTC } = require('../helpers/convertDate');

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
      activated: 1,
    }

    tbl_users.create(newUser)
      .then(async data => {
        let building = await tbl_buildings.findByPk(req.body.building_id)
        let userId = data.null

        if (req.body.dinasId) {
          let newDinas = {
            company_id: req.body.dinasId,
            building_id: req.body.dinasBuildingId,
            user_id: userId
          }
          await tbl_dinas.create(newDinas)
        }

        let newAccountDetail = {
          user_id: userId,
          fullname: req.body.fullname,
          initial: req.body.initial,
          nik: req.body.nik,
          address: req.body.address,
          date_of_birth: req.body.dateOfBirth,
          leave: req.body.leave || 0,
          building_id: req.body.building_id,
          location_id: building.location_id || null,
          company_id: req.body.company_id,
          position_id: req.body.position_id,
          designations_id: req.body.designations_id || null,
          phone: req.body.phone,
          name_evaluator_1: req.body.name_evaluator_1,
          name_evaluator_2: req.body.name_evaluator_2,
          nickname: req.body.nickname,
          departments_id: req.body.departments_id,
          status_employee: req.body.statusEmployee,
          join_date: req.body.joinDate,
          start_leave_big: req.body.startLeaveBig,
          leave_big: req.body.leaveBig,
          next_frame_date: req.body.nextFrameDate,
          next_lensa_date: req.body.nextLensaDate,
          office_email: req.body.officeEmail,
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
        console.log(err)
        res.status(500).json({ err })
      })
  }

  static async register(req, res) {
    var tempNIK
    if (req.body.nik) tempNIK = req.body.nik

    // //nik, address, initial, date_of_birth
    let newUser = {
      username: req.body.username,
      password: hash(req.body.password),
      email: req.body.email,
      permission: "all",
      role_id: req.body.role || 3,
      activated: 1,
    }

    tbl_users.create(newUser)
      .then(async data => {
        let building = await tbl_buildings.findByPk(req.body.building_id)
        let userId = data.null

        if (req.body.dinasId) {
          let newDinas = {
            company_id: req.body.dinasId,
            building_id: req.body.dinasBuildingId,
            user_id: userId
          }
          await tbl_dinas.create(newDinas)
        }

        let newAccountDetail = {
          user_id: userId,
          fullname: req.body.fullname,
          initial: req.body.initial,
          nik: req.body.nik,
          address: req.body.address,
          date_of_birth: req.body.dateOfBirth,
          leave: req.body.leave || 0,
          building_id: req.body.building_id,
          location_id: building.location_id || null,
          company_id: req.body.company_id,
          position_id: req.body.position_id,
          designations_id: req.body.designations_id || null,
          phone: req.body.phone,
          name_evaluator_1: req.body.name_evaluator_1,
          name_evaluator_2: req.body.name_evaluator_2,
          nickname: req.body.nickname,
          departments_id: req.body.departments_id,
          status_employee: req.body.statusEmployee,
          join_date: req.body.joinDate,
          start_leave_big: req.body.startLeaveBig,
          leave_big: req.body.leaveBig,
          next_frame_date: req.body.nextFrameDate,
          next_lensa_date: req.body.nextLensaDate,
          office_email: req.body.officeEmail,
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

        let company = await tbl_companys.findByPk(req.body.company_id)
        let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })

        await tbl_log_employees.create({
          employee: req.body.fullname,
          company: company.company_name,
          action: "CREATE",
          action_by: req.user.user_id + '-' + userDetail.fullname,
          createdAt: createDateAsUTC(new Date()),
          updatedAt: createDateAsUTC(new Date())
        })
      })
      .catch(err => {
        console.log(err)
        let error = {
          uri: 'http://api.polagroup.co.id/users/register',
          method: 'post',
          status: 500,
          message: err,
        }
        logError(error)
        console.log(err)
        res.status(500).json({ err })
      })
  }

  static signin(req, res) {
    let roomMaster, creatorMaster, statusCreatorMaster, statusRoomMaster, creatorAssistant, statusCreatorAssistant, detailUser, MyContactUs, evaluator1, evaluator2
    tbl_users.findOne({ where: { activated: 1, username: req.body.username }, include: [{ as: 'dinas', model: tbl_dinas }] })
      .then(async userFound => {
        if (userFound) {
          if (compare(req.body.password, userFound.password)) {
            let token = sign({ user_id: userFound.user_id })

            detailUser = await tbl_account_details.findOne({
              where: { user_id: userFound.user_id },
              include:
                [
                  { as: "idEvaluator1", model: tbl_users, include: [{ model: tbl_account_details }] },
                  { as: "idEvaluator2", model: tbl_users, include: [{ model: tbl_account_details }] },
                  { model: tbl_designations, include: [{ model: tbl_user_roles }] }
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

            let bawahan = await tbl_account_details.findAll({
              where: { name_evaluator_1: userFound.user_id, },
              include: [
                { model: tbl_companys },
                { model: tbl_users, as: "userId", where: { activated: 1 } }
              ]
            })

            let dinas = [{
              company_id: detailUser.company_id,
              building_id: detailUser.building_id,
              evaluator: detailUser.name_evaluator_1
            }]

            userFound.dinas.length > 0 && userFound.dinas.forEach(el => {
              dinas.push({
                company_id: el.company_id,
                building_id: el.building_id,
                evaluator: el.evaluator_id
              })
            })

            let checkPIC = await tbl_PICs.findOne({ where: { user_id: userFound.user_id } })

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
              bawahan,
              designation: detailUser.tbl_designation ? detailUser.tbl_designation.tbl_user_roles : null,
              dinas,
              isPIC: checkPIC ? true : false
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
        console.log(err)
        res.status(500).json(err)
      })
  }

  static async findAll(req, res) {
    let query = {}, condition = {}, conditionSearch = {}
    if (req.query.page) {
      let offset = +req.query.page, limit = +req.query.limit
      if (offset > 0) offset = offset * limit
      query = { offset, limit }
    }

    if (req.query.company && req.query.company !== '0') condition = { company_id: +req.query.company }
    else if (req.user.user_id !== 1) {
      let userLogin = await tbl_users.findOne({ where: { user_id: req.user.user_id }, include: [{ as: 'dinas', model: tbl_dinas }, { model: tbl_account_details }] })

      let tempCondition = []
      tempCondition.push({ company_id: userLogin.tbl_account_detail.company_id })

      userLogin.dinas.length > 0 && userLogin.dinas.forEach(el => {
        tempCondition.push({
          company_id: el.company_id,
        })
      })

      condition = { [Op.or]: tempCondition }
    }

    if (req.query.search) {
      conditionSearch = {
        [Op.or]: [
          { fullname: { [Op.substring]: req.query.search } },
          { nik: { [Op.substring]: req.query.search } },
        ]
      }
    }

    tbl_users.findAll({
      // where: { activated: 1, user_id: { [Op.ne]: 1 } },
      where: { user_id: { [Op.ne]: 1 } },
      order: [['user_id', 'ASC']],
      ...query,
      include: [{
        model: tbl_account_details,
        where: { ...condition, ...conditionSearch },
        include: [{
          model: tbl_users, as: "idEvaluator1", include: [{ model: tbl_account_details }]
        }, {
          model: tbl_users, as: "idEvaluator2", include: [{ model: tbl_account_details }]
        }, {
          model: tbl_companys
        }, {
          model: tbl_departments
        }, {
          model: tbl_positions
        }]
      }, {
        as: 'dinas',
        model: tbl_dinas
      }]
    })
      .then(async (data) => {
        let allData = await tbl_users.findAll({
          where: { user_id: { [Op.ne]: 1 } },
          include: [{
            model: tbl_account_details,
            where: { ...condition, ...conditionSearch },
          }]
        })
        res.status(200).json({ message: "Success", totalRecord: allData.length, data })
      })
      .catch(err => {
        console.log(err);
        let error = {
          uri: 'http://api.polagroup.co.id/users',
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id,
        }
        logError(error)
        res.status(500).json({ err })
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
        await tbl_account_details.update({ phone: req.body.noHP, updatedAt: createDateAsUTC(new Date()) }, {
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
        message: 'Password invalid',
        user_id: req.user.user_id,
      }
      logError(error)
      res.status(400).json({ msg: "Password invalid" })
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
      .then(async (data) => {
        let bawahan = await tbl_account_details.findAll({
          where: { name_evaluator_1: req.params.id, },
          include: [
            { model: tbl_companys },
            { model: tbl_users, as: "userId", where: { activated: 1 } }
          ]
        })

        res.status(200).json({ message: "Success", data, bawahan })
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

    tbl_users.findByPk(Number(decoded.user_id), { where: { activated: 1 }, include: [{ as: 'dinas', model: tbl_dinas }] })
      .then(async userFound => {
        if (userFound) {
          req.user = userFound
          detailUser = await tbl_account_details.findOne({
            where: { user_id: userFound.user_id },
            include:
              [
                { as: "idEvaluator1", model: tbl_users, include: [{ model: tbl_account_details }] },
                { as: "idEvaluator2", model: tbl_users, include: [{ model: tbl_account_details }] },
                { model: tbl_designations, include: [{ model: tbl_user_roles }] }
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

          let bawahan = await tbl_account_details.findAll({
            where: { name_evaluator_1: userFound.user_id },
            include: [
              { model: tbl_companys }, { model: tbl_users, as: "userId", where: { activated: 1 } }
            ]
          })

          let dinas = [{
            company_id: detailUser.company_id,
            building_id: detailUser.building_id,
            evaluator: detailUser.name_evaluator_1
          }]

          userFound.dinas.length > 0 && userFound.dinas.forEach(el => {
            dinas.push({
              company_id: el.company_id,
              building_id: el.building_id,
              evaluator: el.evaluator_id
            })
          })

          let checkPIC = await tbl_PICs.findOne({ where: { user_id: userFound.user_id } })

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
            bawahan,
            designation: detailUser.tbl_designation ? detailUser.tbl_designation.tbl_user_roles : null,
            dinas,
            isPIC: checkPIC ? true : false
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
        await tbl_account_details.update({ phone: req.body.noHP, updatedAt: createDateAsUTC(new Date()) }, {
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

  static async editProfil(req, res) { //edit diri sendiri
    let newData1, newData2

    newData1 = {
      username: req.body.username,
      email: req.body.email,
    }

    newData2 = {
      fullname: req.body.fullname,
      phone: req.body.phone,
      updatedAt: createDateAsUTC(new Date())
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

  static async editUser(req, res) { //edit orang lain (admin)
    let newData1, newData2

    newData1 = {
      username: req.body.username,
      email: req.body.email,
      activated: req.body.isActive
    }

    if (req.body.password) {
      newData1.password = hash(req.body.password)
    }

    newData2 = {
      fullname: req.body.fullname,
      company_id: req.body.company_id,
      initial: req.body.initial,
      phone: req.body.phone,
      nik: req.body.nik,
      name_evaluator_1: req.body.evaluator1,
      name_evaluator_2: req.body.evaluator2,
      updatedAt: createDateAsUTC(new Date())
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

      if (req.body.password) {
        mailOptions.subject = "Your password has been changed!"
        mailOptions.to = dataReturning.email
        mailOptions.html = `Dear , <br/><br/>Password anda sudah diganti oleh admin menjadi <b>${req.body.password}</b>.<br />Terimakasih`
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            let error = {
              uri: `http://api.polagroup.co.id/editUser/${req.params.id}`,
              method: 'post',
              status: 0,
              message: `Send email to ${dataValues.email} is error`,
              user_id: req.user.user_id
            }
            logError(error)
          }
        })
      }


      let company = await tbl_companys.findByPk(req.body.company_id)
      let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })

      await tbl_log_employees.create({
        employee: req.body.fullname,
        company: company.company_name,
        action: "UPDATE",
        action_by: req.user.user_id + '-' + userDetail.fullname,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      })
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
    tbl_account_details.update({ avatar: `http://165.22.110.159/${req.file.path}`, updatedAt: createDateAsUTC(new Date()) }, {
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
          await tbl_account_details.update({ leave: el.leave, updatedAt: createDateAsUTC(new Date()) }, { where: { nik: el.nik } })
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
            updatedAt: createDateAsUTC(new Date())
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
            let gedung = await building.find(building => building.building === el.gedung)
            let evaluator1 = await accountDetail.find(user => Number(user.nik) === Number(el.nik_evaluator_1))
            let evaluator2 = await accountDetail.find(user => Number(user.nik) === Number(el.nik_evaluator_2))
            let perusahaan = await company.find(pt => pt.acronym === el.perusahaan)
            let posisi = await position.find(pos => pos.position === el.posisi)

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
          await tbl_account_details.update({ nik: tempNIK, updatedAt: createDateAsUTC(new Date()) }, { where: { user_id: user.user_id } })
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

  static async update(req, res) {
    let newData1, newData2

    newData1 = {
      username: req.body.username,
      email: req.body.email,
      activated: req.body.isActive
    }

    if (req.body.password) {
      newData1.password = hash(req.body.password)
    }

    newData2 = {
      fullname: req.body.fullname,
      initial: req.body.initial,
      nik: req.body.nik,
      address: req.body.address,
      leave: req.body.leave || 0,
      building_id: req.body.building_id,
      company_id: req.body.company_id,
      position_id: req.body.position_id,
      phone: req.body.phone,
      name_evaluator_1: req.body.evaluator1,
      name_evaluator_2: req.body.evaluator2,
      nickname: req.body.nickname,
      departments_id: req.body.departments_id,
      status_employee: req.body.statusEmployee,
      leave_big: req.body.leaveBig,
      office_email: req.body.officeEmail,
      updatedAt: createDateAsUTC(new Date())
    }


    if (req.body.dateOfBirth !== '' || req.body.dateOfBirth !== 'null' || req.body.dateOfBirth !== null) newData2.date_of_birth = req.body.dateOfBirth

    if (req.body.joinDate !== '' || req.body.joinDate !== 'null' || req.body.joinDate !== null) newData2.join_date = req.body.joinDate

    if (req.body.startLeaveBig !== '' || req.body.startLeaveBig !== 'null' || req.body.startLeaveBig !== null) newData2.start_leave_big = req.body.startLeaveBig

    if (req.body.nextFrameDate !== '' || req.body.nextFrameDate !== 'null' || req.body.nextFrameDate !== null) newData2.next_frame_date = req.body.nextFrameDate

    if (req.body.nextLensaDate !== '' || req.body.nextLensaDate !== 'null' || req.body.nextLensaDate !== null) newData2.next_lensa_date = req.body.nextLensaDate


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

      let company = await tbl_companys.findByPk(req.body.company_id)
      let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })

      await tbl_log_employees.create({
        employee: req.body.fullname,
        company: company.company_name,
        action: "UPDATE",
        action_by: req.user.user_id + '-' + userDetail.fullname,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      })
    } catch (err) {
      console.log(err)
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

  static async settingImportUser(req, res) {
    let result

    try {
      if (req.body.jenisImport === "add") {
        result = excelToJson({
          sourceFile: req.file.path,
          sheets: [{
            name: 'Sheet1',
            header: {
              rows: 1
            },
            columnToKey: {
              A: 'nik',
              B: 'fullname',//-
              C: 'nickname',//-
              D: 'initial',//-
              E: 'birth_date',//-
              F: 'address',//-
              G: 'phone',//
              H: 'selfEmail',//
              I: 'officeEmail',//
              J: 'username',//
              K: 'building',//        // id
              L: 'company',//         // id
              M: 'evaluator1',//      // id
              N: 'evaluator2',//      // id
              O: 'department',//      // id
              P: 'position',//        // id
              Q: 'leave',//
              R: 'statusEmpolyee',//
              S: 'joinDate',//
              T: 'startBigLeave',//
              U: 'bigLeave',//
              V: 'nextFrameDate',//
              W: 'nextLensaDate'//
            }
          }]
        })

        let building = await tbl_buildings.findAll()
        let accountDetail = await tbl_account_details.findAll()
        let company = await tbl_companys.findAll()
        let position = await tbl_positions.findAll()
        let department = await tbl_departments.findAll()

        await result.Sheet1.forEach(async el => {

          let gedung = await building.find(building => building.building === el.building)
          let evaluator1 = await accountDetail.find(user => Number(user.nik) === Number(el.evaluator1))
          let evaluator2 = await accountDetail.find(user => Number(user.nik) === Number(el.evaluator2))
          let perusahaan = await company.find(pt => pt.acronym.toLowerCase() === el.company.toLowerCase())
          let posisi = await position.find(pos => pos.position.toLowerCase() === el.position.toLowerCase())
          let divisi = await department.find(div => div.deptname.toLowerCase() === el.department.toLowerCase())

          let dateBirth = new Date(el.birth_date).getDate()
          let monthBirth = new Date(el.birth_date).getMonth() + 1

          if (dateBirth < 10) dateBirth = `0${dateBirth}`
          if (monthBirth < 10) monthBirth = `0${monthBirth}`

          let newUser = {
            username: el.username,
            password: hash(`${dateBirth}${monthBirth}${new Date(el.birth_date).getFullYear()}`),
            email: el.selfEmail,
            permission: "all",
            role_id: 3,
            activated: 1,
          }

          tbl_users.create(newUser)
            .then(async data => {
              let newAccountDetail = {
                user_id: data.null,
                fullname: el.fullname,
                nickname: el.nickname,
                initial: el.initial,
                address: el.address,
                date_of_birth: el.birth_date,
                leave: el.leave || 0,
                phone: el.phone,
                status_employee: el.statusEmpolyee,
                join_date: el.joinDate,
                start_leave_big: el.startBigLeave,
                leave_big: el.bigLeave,
                next_frame_date: el.nextFrameDate,
                next_lensa_date: el.nextLensaDate,
                office_email: el.officeEmail,
              }


              if (perusahaan) newAccountDetail.company_id = perusahaan.company_id

              if (posisi) newAccountDetail.position_id = posisi.position_id

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
              } else {
                tempNIK = el.nik
              }
              newAccountDetail.nik = tempNIK

              let createAccountDetail = await tbl_account_details.create(newAccountDetail)
            })

        })
      } else {
        result = excelToJson({
          sourceFile: req.file.path,
          sheets: [{
            name: 'Sheet1',
            header: {
              rows: 1
            },
            columnToKey: {
              A: 'nik',
              B: 'fullname',//-
              C: 'nickname',//-
              D: 'initial',//-
              E: 'birth_date',//-
              F: 'address',//-
              G: 'phone',//
              H: 'selfEmail',//
              I: 'officeEmail',//
              J: 'username',//
              K: 'building',//        // id
              L: 'company',//         // id
              M: 'evaluator1',//      // id
              N: 'evaluator2',//      // id
              O: 'department',//      // id
              P: 'position',//        // id
              Q: 'leave',//
              R: 'statusEmpolyee',//
              S: 'joinDate',//
              T: 'startBigLeave',//
              U: 'bigLeave',//
              V: 'nextFrameDate',//
              W: 'nextLensaDate'//
            }
          }]
        })

        let building = await tbl_buildings.findAll()
        let accountDetail = await tbl_account_details.findAll()
        let company = await tbl_companys.findAll()
        let position = await tbl_positions.findAll()
        let department = await tbl_departments.findAll()

        await result.Sheet1.forEach(async el => {

          let tempNIK
          if (String(el.nik).length < 5) {
            tempNIK = el.nik
            for (let i = String(el.nik).length; i < 5; i++) {
              tempNIK = `0${tempNIK}`
            }
          } else {
            tempNIK = el.nik
          }

          let account = await accountDetail.find(user => user.nik === tempNIK)


          if (account) {
            let newData1 = {}
            if (req.body.username) newData1.username = el.username
            if (req.body.email) newData1.email = el.selfEmail
            tbl_users.update(newData1, { where: { user_id: account.user_id } })
              .then(() => { })
              .catch(() => { })


            let newData2 = { updatedAt: createDateAsUTC(new Date()) }
            if (req.body.fullname) newData2.fullname = el.fullname
            if (req.body.nickname) newData2.nickname = el.nickname
            if (req.body.initial) newData2.initial = el.initial
            if (req.body.birth_date) newData2.date_of_birth = el.birth_date
            if (req.body.address) newData2.address = el.address
            if (req.body.phone) newData2.phone = el.phone
            if (req.body.officeEmail) newData2.office_email = el.officeEmail
            if (req.body.leave) newData2.leave = el.leave
            if (req.body.statusEmpolyee) newData2.status_employee = el.statusEmpolyee
            if (req.body.joinDate) newData2.join_date = el.joinDate
            if (req.body.startBigLeave) newData2.start_leave_big = el.startBigLeave
            if (req.body.bigLeave) newData2.leave_big = el.bigLeave
            if (req.body.nextFrameDate) newData2.next_frame_date = el.nextFrameDate
            if (req.body.nextLensaDate) newData2.next_lensa_date = el.nextLensaDate

            if (req.body.building) {
              let gedung = await building.find(building => building.building === el.building)

              if (gedung) {
                newData2.building_id = gedung.building_id
                newData2.location_id = gedung.location_id
              }
            }

            if (req.body.company) {
              let perusahaan = await company.find(pt => pt.acronym.toLowerCase() === el.company.toLowerCase())

              if (perusahaan) newData2.company_id = perusahaan.company_id
            }

            if (req.body.evaluator1) {
              let evaluator1 = await accountDetail.find(user => Number(user.nik) === Number(el.evaluator1))

              if (evaluator1) newAccountDetail.name_evaluator_1 = evaluator1.user_id
            }

            if (req.body.evaluator2) {
              let evaluator2 = await accountDetail.find(user => Number(user.nik) === Number(el.evaluator2))

              if (evaluator2) newAccountDetail.name_evaluator_2 = evaluator2.user_id
            }

            if (req.body.department) {
              let divisi = await department.find(div => div.deptname.toLowerCase() === el.department.toLowerCase())

              if (divisi) newAccountDetail.departments_id = divisi.departments_id
            }

            if (req.body.position) {
              let posisi = await position.find(pos => pos.position.toLowerCase() === el.position.toLowerCase())

              if (posisi) newAccountDetail.position_id = posisi.position_id
            }

            await tbl_account_details.update(newData2, { where: { user_id: account.user_id } })
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

  static async findAllLog(req, res) {
    try {
      let data
      if (req.query.date) {
        let year = new Date(req.query.date).getFullYear()
        let month = new Date(req.query.date).getMonth() + 1, nextMonth = month + 1

        if (month < 10) {
          month = `0${month}`
        }
        if (nextMonth < 10) {
          nextMonth = `0${nextMonth}`
        }

        data = await tbl_log_employees.findAll({
          where: {
            createdAt: {
              [Op.between]: [`${year}-${month}-01 00:00:00`, `${year}-${nextMonth}-01 00:00:00`]
            }
          },
          order: [['createdAt', 'DESC']]
        })
      } else {
        data = await tbl_log_employees.findAll({ order: [['createdAt', 'DESC']] })
      }
      res.status(200).json({ message: "Success", data })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/address/log`,
        method: 'delete',
        status: 500,
        message: err,
        user_id: req.user.user_id
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
