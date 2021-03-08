const { tbl_users, tbl_account_details, tbl_master_rooms, tbl_master_creators, tbl_contacts, tbl_buildings, tbl_companys, tbl_positions, tbl_dinas, tbl_departments, tbl_designations, tbl_user_roles, tbl_log_employees, tbl_PICs, tbl_structure_departments, tbl_department_positions, tbl_activity_logins, tbl_admin_companies } = require('../models');
const { compare, hash } = require('../helpers/bcrypt');
const { sign, verify } = require('../helpers/jwt');
const { mailOptions, createTransporter, transporter } = require('../helpers/nodemailer');
const logError = require('../helpers/logError');
const excelToJson = require('convert-excel-to-json');
const { createDateAsUTC } = require('../helpers/convertDate');

const Sequelize = require('sequelize');
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

        let findNew = await tbl_users.findByPk(createAccountDetail.user_id, {
          include: [{
            // as: "tbl_account_detail",
            model: tbl_account_details
          }]
        })

        res.setHeader('Cache-Control', 'no-cache');
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
          designations_id: req.body.designations_id || null,
          phone: req.body.phone,
          name_evaluator_1: req.body.name_evaluator_1 || null,
          name_evaluator_2: req.body.name_evaluator_2 || null,
          nickname: req.body.nickname,
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

        let listDivisi = JSON.parse(req.body.list_divisi)
        listDivisi && listDivisi.length > 0 && await listDivisi.forEach(async (divisi) => {
          if (divisi.divisi && divisi.peran) {
            let checkDepartment = await tbl_structure_departments.findOne({
              where: { company_id: req.body.company_id, departments_id: divisi.divisi }
            })

            if (checkDepartment) {
              let newPosition = {
                position_id: divisi.peran,
                structure_department_id: checkDepartment.id,
                user_id: userId
              }
              await tbl_department_positions.create(newPosition)
            }
          }
        })

        if (req.body.list_divisi_dinas) {
          let listDivisiDinas = JSON.parse(req.body.list_divisi_dinas)
          listDivisiDinas && listDivisiDinas.length > 0 && await listDivisiDinas.forEach(async (divisi) => {
            let checkDepartment = await tbl_structure_departments.findOne({
              where: { company_id: req.body.dinasId, departments_id: divisi.divisi }
            })

            if (checkDepartment) {
              let newPosition = {
                position_id: divisi.peran,
                structure_department_id: checkDepartment.id,
                user_id: userId
              }
              await tbl_department_positions.create(newPosition)
            }

          })
        }

        // if (req.file) newAccountDetail.avatar = `http://api.polagroup.co.id/${req.file.path}`
        if (req.file) newAccountDetail.avatar = `http://165.22.110.159/${req.file.path}`

        let createAccountDetail = await tbl_account_details.create(newAccountDetail)

        let findNew = await tbl_users.findByPk(createAccountDetail.user_id, {
          include: [{
            // as: "tbl_account_detail", 
            model: tbl_account_details
          }]
        })

        res.setHeader('Cache-Control', 'no-cache');
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
    tbl_users.findOne({ where: { activated: 1, username: req.body.username }, include: [{ as: 'dinas', model: tbl_dinas }, { model: tbl_admin_companies, include: [{ model: tbl_designations, include: [{ model: tbl_user_roles }] }, { model: tbl_companys }] }] })
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
                { as: 'tbl_company', model: tbl_companys },
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

            // let checkPIC = await tbl_PICs.findAll({ where: { user_id: userFound.user_id }, include: [{ model: tbl_companys }] })

            // await tbl_activity_logins.create({
            //   user_id: userFound.user_id,
            //   os: req.headers.os,
            //   browser: req.headers.browser,
            //   ip: req.headers.ip || '-',
            //   is_mobile: req.headers.isMobile === 'true' ? 1 : 0,
            //   last_login: createDateAsUTC(new Date())
            // })

            let checkFirstHierarchy = await tbl_structure_departments.findOne({ where: { hierarchy: 1 }, include: [{ model: tbl_department_positions, where: { user_id: userFound.user_id } }] })


            res.setHeader('Cache-Control', 'no-cache');
            res.status(200).json({
              message: "Success",
              token,
              username: userFound.username,
              nickname: detailUser.nickname,
              fullname: detailUser.fullname,
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
              admin: userFound.tbl_admin_companies || [],
              firstHierarchy: checkFirstHierarchy ? 1 : 0,
            })

            // req.headers['user-agent']
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
    let query = {}, condition = {}, conditionPT = {}, conditionDinas = {}, conditionStatus = {}, conditionSearch = {}, order = []
    // if (req.query.page) {
    //   let offset = +req.query.page, limit = +req.query.limit
    //   if (offset > 0) offset = offset * limit
    //   query = { offset, limit }
    // }

    if (req.query.search) {
      conditionSearch = {
        [Op.or]: [
          { fullname: { [Op.substring]: req.query.search } },
          { nik: { [Op.substring]: req.query.search } },
        ]
      }
    }

    if (req.query.order) {
      let field

      if (req.query.order === 'name') field = '`tbl_account_detail.fullname`'
      if (req.query.order === 'status_employee') field = '`tbl_account_detail.status_employee`'
      if (req.query.order === 'status') field = 'activated'
      // [Sequelize.literal('`tbl_account_detail.fullname`'), req.query.sort],

      order = [
        [Sequelize.literal(field), req.query.sort],
      ]
    } else {
      order = [
        ['user_id', 'ASC']
      ]
    }

    if (req.query.status) {
      conditionStatus = { status_employee: req.query.status }
    } else if (!req.query.search) conditionStatus = {
      [Op.or]: [
        { status_employee: { [Op.ne]: 'Berhenti' } },
        { status_employee: { [Op.is]: null } }
      ]
    }

    if (req.query.company && req.query.company !== '0') {
      conditionPT = { company_id: req.query.company }
      condition = {
        [Op.or]: [
          { '$tbl_account_detail.company_id$': +req.query.company },
          { '$dinas.company_id$': +req.query.company }
        ]
      }
    }
    else if (req.user.user_id !== 1) {
      let userAdmin = await tbl_admin_companies.findAll({ where: { user_id: req.user.user_id } })

      let tempConditionPT = [], tempConditionDinas = [], idCompany = [], tempPt = []

      userAdmin && userAdmin.forEach(el => {
        if (idCompany.indexOf(el.company_id) === -1) {
          idCompany.push(el.company_id)

          tempConditionPT.push({ '$tbl_account_detail.company_id$': el.company_id })
          tempConditionDinas.push({ '$dinas.company_id$': el.company_id })
          tempPt.push({ company_id: el.company_id })
        }
      })

      if (tempConditionPT.length > 1) {
        conditionPT = {
          [Op.or]: tempPt
        }
        condition = {
          [Op.or]: [
            ...tempConditionPT,
            ...tempConditionDinas
          ]
        }
      } else {
        conditionPT = tempPt[0]
        condition = {
          [Op.or]: [
            tempConditionPT[0],
            tempConditionDinas[0]
          ]
        }
        // condition = tempConditionPT[0]
      }
    }


    tbl_users.findAll({
      // where: { activated: 1, user_id: { [Op.ne]: 1 } },
      where: {
        user_id: { [Op.ne]: 1 },
        ...condition
      },
      // ...query,
      include: [{
        required: true,
        model: tbl_account_details,
        // where: { ...conditionPT, ...conditionStatus, ...conditionSearch },
        where: { ...conditionStatus, ...conditionSearch },
        include: [{
          model: tbl_users, as: "idEvaluator1", include: [{ model: tbl_account_details }]
        }, {
          model: tbl_users, as: "idEvaluator2", include: [{ model: tbl_account_details }]
        }, {
          as: 'tbl_company',
          model: tbl_companys
        }, {
          model: tbl_departments
        }, {
          model: tbl_positions
        }]
      }, {
        as: 'dinas',
        model: tbl_dinas
      }, {
        model: tbl_department_positions,
        include: [{
          model: tbl_structure_departments,
          include: [{ model: tbl_companys, attributes: ['company_id', 'company_name', 'acronym'] }, { model: tbl_departments, as: "department", attributes: ['deptname'] }]
        }, {
          model: tbl_positions
        }]
      }],
      order
    })
      .then(async (data) => {
        let allData = await tbl_users.findAll({
          include: [{
            // as: "tbl_account_detail",
            model: tbl_account_details,
            where: { ...conditionStatus, ...conditionSearch },
          }, {
            as: 'dinas',
            model: tbl_dinas,
          }],
          where: {
            user_id: { [Op.ne]: 1 },
            ...condition
          }
        })

        if (req.query.page) data = data.slice((req.query.page * (req.query.limit)), ((+req.query.page + 1) * (req.query.limit)))

        res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json({ message: "Success", totalRecord: allData.length, data })
      })
      .catch(err => {
        console.log(err);
        // let error = {
        //   uri: 'http://api.polagroup.co.id/users',
        //   method: 'get',
        //   status: 500,
        //   message: err,
        //   user_id: req.user.user_id,
        // }
        // logError(error)
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

        res.setHeader('Cache-Control', 'no-cache');
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
            { as: 'tbl_company', model: tbl_companys },
            // as: "userId",  =>  as: "tbl_account_detail",  
            { model: tbl_users, as: "userId", where: { activated: 1 } }
          ]
        })

        res.setHeader('Cache-Control', 'no-cache');
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

    tbl_users.findOne({ where: { user_id: decoded.user_id, activated: 1 }, include: [{ as: 'dinas', model: tbl_dinas }, { model: tbl_admin_companies, include: [{ model: tbl_designations, include: [{ model: tbl_user_roles }] }, { model: tbl_companys }] }] })
      .then(async userFound => {
        if (userFound) {
          req.user = userFound
          detailUser = await tbl_account_details.findOne({
            where: { user_id: userFound.user_id },
            include:
              [
                {
                  as: "idEvaluator1", model: tbl_users, include: [{
                    model: tbl_account_details
                  }]
                },
                {
                  as: "idEvaluator2", model: tbl_users, include: [{
                    model: tbl_account_details
                  }]
                },
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
              {
                as: 'tbl_company',
                model: tbl_companys
              }, {
                // as: "userId",  =>  as: "tbl_account_detail",  
                model: tbl_users, as: "userId", where: { activated: 1 }
              }
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

          let checkFirstHierarchy = await tbl_structure_departments.findOne({ where: { hierarchy: 1 }, include: [{ model: tbl_department_positions, where: { user_id: userFound.user_id } }] })

          res.setHeader('Cache-Control', 'no-cache');
          res.status(200).json({
            message: 'Oke',
            username: userFound.username,
            nickname: detailUser.nickname,
            fullname: detailUser.fullname,
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
            admin: userFound.tbl_admin_companies || [],
            firstHierarchy: checkFirstHierarchy ? 1 : 0,
            // dinas,
            // PIC: checkPIC
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

        res.setHeader('Cache-Control', 'no-cache');
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
          // as: "tbl_account_detail",
          model: tbl_account_details,
        }]
      })

      res.setHeader('Cache-Control', 'no-cache');
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
          // as: "tbl_account_detail",
          model: tbl_account_details,
        }]
      })

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: "Success", data: dataReturning })

      if (req.body.password) {
        mailOptions.subject = "Your password has been changed!"
        mailOptions.to = dataReturning.email
        mailOptions.html = `Dear , <br/><br/>Password anda sudah diganti oleh admin menjadi <b>${req.body.password}</b>.<br />Terimakasih`

        // let sendEmail = await createTransporter()
        // sendEmail.sendMail(mailOptions, function (error, info) {
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
            // as: "tbl_account_detail",
            model: tbl_account_details,
          }]
        })

        res.setHeader('Cache-Control', 'no-cache');
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

    //     res.setHeader('Cache-Control', 'no-cache');
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
              username: el.username || el.nik,
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

                await tbl_account_details.create(newAccountDetail)
              })
          }

        })
      }

      res.setHeader('Cache-Control', 'no-cache');
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

      res.setHeader('Cache-Control', 'no-cache');
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
      name_evaluator_1: req.body.name_evaluator_1 || null,
      name_evaluator_2: req.body.name_evaluator_2 || null,
      nickname: req.body.nickname,
      departments_id: req.body.departments_id,
      status_employee: req.body.statusEmployee,
      leave_big: req.body.leaveBig,
      office_email: req.body.officeEmail,
      updatedAt: createDateAsUTC(new Date())
    }


    if (req.body.dateOfBirth !== '' && req.body.dateOfBirth !== 'null' && req.body.dateOfBirth !== null && req.body.dateOfBirth !== '0000-00-00') newData2.date_of_birth = req.body.dateOfBirth

    if (req.body.joinDate !== '' && req.body.joinDate !== 'null' && req.body.joinDate !== null && req.body.joinDate !== '0000-00-00') newData2.join_date = req.body.joinDate

    if (req.body.startLeaveBig !== '' && req.body.startLeaveBig !== 'null' && req.body.startLeaveBig !== null && req.body.startLeaveBig !== '0000-00-00') newData2.start_leave_big = req.body.startLeaveBig

    if (req.body.nextFrameDate !== '' && req.body.nextFrameDate !== 'null' && req.body.nextFrameDate !== null && req.body.nextFrameDate !== '0000-00-00') newData2.next_frame_date = req.body.nextFrameDate

    if (req.body.nextLensaDate !== '' && req.body.nextLensaDate !== 'null' && req.body.nextLensaDate !== null && req.body.nextLensaDate !== '0000-00-00') newData2.next_lensa_date = req.body.nextLensaDate


    try {
      await tbl_users.update(newData1, {
        where: { user_id: req.params.id }
      })
      await tbl_account_details.update(newData2, {
        where: { user_id: req.params.id }
      })


      let dataPosition = await tbl_department_positions.findAll({
        where: { user_id: req.params.id },
        include: [{ model: tbl_structure_departments, where: { company_id: req.body.company_id } }]
      })

      let listDivisi = req.body.list_divisi ? JSON.parse(req.body.list_divisi) : []

      dataPosition.forEach(async (el) => {
        let checkAvailable = listDivisi.find(element => el.id === element.id)
        if (!checkAvailable) await tbl_department_positions.destroy({ where: { id: el.id } })
      })


      listDivisi && listDivisi.length > 0 && await listDivisi.forEach(async (divisi) => {
        if (divisi.divisi && divisi.peran) {
          if (divisi.id) {
            let checkDepartment = await tbl_structure_departments.findOne({
              where: { company_id: req.body.company_id, departments_id: divisi.divisi }
            })

            if (checkDepartment) {
              let newPosition = {
                position_id: divisi.peran,
                structure_department_id: checkDepartment.id,
                user_id: req.params.id
              }
              await tbl_department_positions.update(newPosition, { where: { id: divisi.id } })
            }
          } else {
            let checkDepartment = await tbl_structure_departments.findOne({
              where: { company_id: req.body.company_id, departments_id: divisi.divisi }
            })

            if (checkDepartment) {
              let newPosition = {
                position_id: divisi.peran,
                structure_department_id: checkDepartment.id,
                user_id: req.params.id
              }
              await tbl_department_positions.create(newPosition)
            }
          }
        }
      })

      let dataReturning = await tbl_users.findByPk(req.params.id, {
        include: [{
          // as: "tbl_account_detail",
          model: tbl_account_details,
        }]
      })

      res.setHeader('Cache-Control', 'no-cache');
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
              O: 'leave',//
              P: 'statusEmpolyee',//
              Q: 'joinDate',//
              R: 'startBigLeave',//
              S: 'bigLeave',//
              T: 'nextFrameDate',//
              U: 'nextLensaDate'//
            }
          }]
        })

        let building = await tbl_buildings.findAll()
        let accountDetail = await tbl_account_details.findAll()
        let company = await tbl_companys.findAll()

        await result.Sheet1.forEach(async el => {
          let perusahaan = el.company ? await company.find(pt => pt.acronym.toLowerCase() === el.company.toLowerCase()) : null
          let query = {}

          if (perusahaan) query = { company_id: perusahaan.company_id }
          let checkEmpolyee = await tbl_account_details.findOne({ where: { nik: el.nik, ...query } })
          let checkUser = await tbl_users.findOne({ where: { username: el.username } })

          if (!checkEmpolyee && !checkUser) {
            let gedung = el.building ? await building.find(building => building.building === el.building) : null
            let evaluator1 = el.evaluator1 ? await accountDetail.find(user => Number(user.nik) === Number(el.evaluator1)) : null
            let evaluator2 = el.evaluator2 ? await accountDetail.find(user => Number(user.nik) === Number(el.evaluator2)) : null

            let dateBirth, monthBirth, password
            if (el.birth_date) {
              dateBirth = new Date(el.birth_date).getDate()
              monthBirth = new Date(el.birth_date).getMonth() + 1
              if (dateBirth < 10) dateBirth = `0${dateBirth}`
              if (monthBirth < 10) monthBirth = `0${monthBirth}`
              password = hash(`${dateBirth}${monthBirth}${new Date(el.birth_date).getFullYear()}`)
            } else {
              password = hash(`${el.nik}`)
            }

            let newUser = {
              username: el.username || el.nik,
              password,
              email: el.selfEmail || null,
              permission: "all",
              role_id: 3,
              activated: 1,
            }

            tbl_users.create(newUser)
              .then(async data => {
                let newAccountDetail = {
                  user_id: data.null,
                  fullname: el.fullname || null,
                  nickname: el.nickname || null,
                  initial: el.initial || null,
                  address: el.address || null,
                  date_of_birth: el.birth_date ? new Date(new Date(el.birth_date).setHours(new Date(el.birth_date).getHours() + 9)) : null,
                  leave: el.leave || 0,
                  phone: el.phone || null,
                  status_employee: el.statusEmpolyee || null,
                  join_date: el.joinDate || null,
                  start_leave_big: el.startBigLeave || null,
                  leave_big: el.bigLeave || null,
                  next_frame_date: el.nextFrameDate || null,
                  next_lensa_date: el.nextLensaDate || null,
                  office_email: el.officeEmail || null,
                }


                if (perusahaan) newAccountDetail.company_id = perusahaan.company_id

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

                await tbl_account_details.create(newAccountDetail)
              })
          }
        })
      } else {
        result = excelToJson({
          sourceFile: req.file.path,
          sheets: [{
            name: 'Sheet1',
          }]
        })

        let userId, nik, fullname, nickname, initial, date_of_birth, address, phone, selfEmail, officeEmail, username, evaluator1, evaluator2, company, leave, statusEmpolyee, joinDate, startBigLeave, bigLeave, nextFrameDate, nextLensaDate

        let header = result.Sheet1[0]

        for (let key in header) {
          if (header[key].indexOf('id') != -1) userId = key
          else if (header[key].indexOf('nik') != -1) nik = key
          else if (header[key].indexOf('fullname') != -1) fullname = key
          else if (header[key].indexOf('nickname') != -1) nickname = key
          else if (header[key].indexOf('initial') != -1) initial = key
          else if (header[key].indexOf('date_of_birth') != -1) date_of_birth = key
          else if (header[key].indexOf('address') != -1) address = key
          else if (header[key].indexOf('phone') != -1) phone = key
          else if (header[key].indexOf('selfEmail') != -1) selfEmail = key
          else if (header[key].indexOf('officeEmail') != -1) officeEmail = key
          else if (header[key].indexOf('username') != -1) username = key
          else if (header[key].indexOf('evaluator1') != -1) evaluator1 = key
          else if (header[key].indexOf('evaluator2') != -1) evaluator2 = key
          else if (header[key].indexOf('company') != -1) company = key
          else if (header[key].indexOf('leave') != -1) leave = key
          else if (header[key].indexOf('statusEmpolyee') != -1) statusEmpolyee = key
          else if (header[key].indexOf('joinDate') != -1) joinDate = key
          else if (header[key].indexOf('startBigLeave') != -1) startBigLeave = key
          else if (header[key].indexOf('bigLeave') != -1) bigLeave = key
          else if (header[key].indexOf('nextFrameDate') != -1) nextFrameDate = key
          else if (header[key].indexOf('nextLensaDate') != -1) nextLensaDate = key
        }

        let listData = result.Sheet1.slice(1, result.Sheet1.length)

        let accountDetail = await tbl_account_details.findAll()
        let listCompany = await tbl_companys.findAll()

        await listData.forEach(async el => {
          let tempNIK
          if (String(el[nik]).length < 5) {
            tempNIK = el[nik]
            for (let i = String(el[nik]).length; i < 5; i++) {
              tempNIK = `0${tempNIK}`
            }
          } else {
            tempNIK = el[nik]
          }
          let account = await accountDetail.find(user => user.user_id === el[userId])

          if (account) {
            let newData1 = {}
            if (username) newData1.username = el[username]
            if (selfEmail) newData1.email = el[selfEmail]
            tbl_users.update(newData1, { where: { user_id: account.user_id } })
              .then(() => { })
              .catch(() => { })

            let newData2 = {}
            if (nik) newData2.nik = el[nik]
            if (fullname) newData2.fullname = el[fullname]
            if (nickname) newData2.nickname = el[nickname]
            if (initial) newData2.initial = el[initial]
            if (date_of_birth) newData2.date_of_birth = new Date(new Date(el[date_of_birth]).setHours(new Date(el[date_of_birth]).getHours() + 9))
            if (address) newData2.address = el[address]
            if (phone) newData2.phone = el[phone]
            if (officeEmail) newData2.office_email = el[officeEmail]
            if (leave) newData2.leave = el[leave]
            if (statusEmpolyee) newData2.status_employee = el[statusEmpolyee]
            if (joinDate) newData2.join_date = el[joinDate]
            if (startBigLeave) newData2.start_leave_big = el[startBigLeave]
            if (bigLeave) newData2.leave_big = el[bigLeave]
            if (nextFrameDate) newData2.next_frame_date = el[nextFrameDate]
            if (nextLensaDate) newData2.next_lensa_date = el[nextLensaDate]
            newData2.updatedAt = createDateAsUTC(new Date())

            if (company) {
              let perusahaan = await listCompany.find(pt => pt.acronym.toLowerCase() === el[company].toLowerCase())
              if (perusahaan) newData2.company_id = perusahaan.company_id
            }

            if (evaluator1) {
              let selectEvaluator1 = await accountDetail.find(user => Number(user.nik) === Number(el[evaluator1]))
              if (selectEvaluator1) newData2.name_evaluator_1 = selectEvaluator1.user_id
            }

            if (evaluator2) {
              let selectEvaluator2 = await accountDetail.find(user => Number(user.nik) === Number(el[evaluator2]))
              if (selectEvaluator2) newData2.name_evaluator_2 = selectEvaluator2.user_id
            }
            await tbl_account_details.update(newData2, { where: { user_id: account.user_id } })
          }
        })
      }

      res.setHeader('Cache-Control', 'no-cache');
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

      res.setHeader('Cache-Control', 'no-cache');
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

  static async signout(req, res) {
    try {
      // await tbl_activity_logins.update({
      //   status: 0,
      //   last_login: createDateAsUTC(new Date())
      // }, { where: { ip: req.headers.ip, status: 1 } })

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: "Success" })
    } catch (err) {
      console.log(err)
      res.status(500).json({ err })
    }
  }

  static async forOption(req, res) {
    let condition = {}

    if (req.user.user_id !== 1) {
      let userAdmin = await tbl_admin_companies.findAll({ where: { user_id: req.user.user_id } })

      let idCompany = [], tempCondition = [
        { user_id: 30 },
        { user_id: 265 },
        { user_id: 269 },
        { user_id: 1073 },
      ]

      userAdmin && userAdmin.forEach(el => {
        if (idCompany.indexOf(el.company_id) === -1) {
          idCompany.push(el.company_id)
          // tempCondition.push({
          //   company_id: el.company_id,
          // })
          tempCondition.push(
            { '$tbl_account_detail.company_id$': el.company_id },
            { '$dinas.company_id$': el.company_id }
          )
        }
      })

      condition = { [Op.or]: tempCondition }
    }

    tbl_users.findAll({
      where: {
        user_id: { [Op.ne]: 1 },
        ...condition
      },
      include: [{
        model: tbl_account_details,
        where: {
          [Op.or]: [
            { status_employee: { [Op.ne]: 'Berhenti' } },
            { status_employee: { [Op.is]: null } }
          ]
        },
        attributes: ['user_id', 'fullname', 'nik', 'status_employee'],
      }, {
        as: 'dinas',
        model: tbl_dinas,
      }],
      attributes: ['user_id'],
      order: [
        [Sequelize.literal('tbl_account_detail.fullname'), 'asc'],
      ]

    })
      .then(async (data) => {
        res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json({ message: "Success", total: data.length, data })
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

  static async forgetPassword(req, res) {
    try {
      let user = await tbl_users.findOne({ where: { email: req.query.email }, include: [{ model: tbl_account_details }] });

      if (user) {
        let randomNumber = Math.floor(Math.random() * 10);
        let key = `${user.user_id}${new Date().setHours(new Date().getHours())}${randomNumber}`

        await tbl_users.update({ new_password_key: key, new_password_requested: createDateAsUTC(new Date()) }, { where: { user_id: user.user_id } })

        mailOptions.to = [user.email, user.tbl_account_detail.office_email];
        mailOptions.subject = 'Reset password Polaku';
        mailOptions.html = `
				<img src="${process.env.BaseUrlServer}/asset/img/logo-polagroup.png" height="30" width="150" alt="logo-polagroup" />
				<p style="font-size: 20px;"><b>Hai ${user.tbl_account_detail.fullname}</b></p>
				<p style="margin:10px 0px;">Kami baru saja menerima permintaan untuk mengganti password.</p>
				<p style="margin:10px 0px;">Silahkan klik link di bawah dan ikuti petunjuk untuk mengganti password Anda.</p>
				<br />
        <p style="margin:10px 0px;">Username anda adalah <b>${user.username}</b></p>
				<div style="border-radius: 2px;background-color:#91c640;width:128px;">
					<a href="${process.env.BaseUrlClient}/reset-password/${key}" target="_blank" style="padding: 8px 12px; border: 1px solid #91c640; border-radius: 2px; color: #ffffff; text-decoration: none; font-weight:bold;display: inline-block;">
						Reset Password
					</a>
				</div>
        <p style="margin:5px 0px 10px 0px; font-size: 10px;">Link hanya berlaku selama 24 jam dan hanya satu kali pakai</p>
				<br />
				<p style="margin:10px 0px 10px 0px;">Jika permintaan penggantian password ini bukan dari Anda, atau jika Anda merasa akun Anda sedang diretas, silahkan laporkan ke polaku.digital@gmail.com</p>
				
				<div style="border-top:1px solid #aaa;font-size:0;margin:8px auto;"></div>
				<div style="text-align:center;font-size: small;">
				<b>Email ini dibuat secara otomatis. Mohon tidak mengirim balasan ke email ini.</b>
				</div>
				<div style="border-top:1px solid #aaa;font-size:0;margin:8px auto;"></div>
				`;

        // let sendEmail = await createTransporter()
        // sendEmail.sendMail(mailOptions, function (error, info) {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log('GAGAL');
            console.log(error);
            res.status(400).json({ message: 'failed' });
          } else {
            res.setHeader('Cache-Control', 'no-cache');
            res.status(200).json({ message: 'success' });
            console.log('Berhasil');
          }
        });
      } else {
        res.status(400).json({ message: 'failed' });
        console.log('User not found');
      }
    } catch (Error) {
      console.log(createDateAsUTC(new Date()), Error);
      res.status(500).json({ Error });
    }
  }

  static async resetPassword(req, res) {
    try {
      let user = await tbl_users.findOne({ where: { new_password_key: req.params.token } });

      if (user) {
        if (user.new_password_requested.setDate(user.new_password_requested.getDate() + 1) > createDateAsUTC(new Date())) {
          await tbl_users.update({ new_password_key: null, password: hash(req.body.password) }, { where: { user_id: user.user_id } });
          let token = sign({ user_id: user.user_id })

          res.setHeader('Cache-Control', 'no-cache');
          res.status(200).json({ message: 'success', token })
        } else {
          await tbl_users.update({ new_password_key: null }, { where: { user_id: user.user_id } });
          res.status(400).json({ message: 'link expired' })
        }
      } else {
        res.status(400).json({ message: 'token not found' })
      }
    } catch (Error) {
      console.log('error reset password', createDateAsUTC(new Date()), Error);
      res.status(500).json({ Error });
    }
  }
}

// queue.process('email', function (job, done) {
//    // let sendEmail = await createTransporter()
//    // sendEmail.sendMail(mailOptions, function (error, info) {
//    transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       return console.log(error);
//     } else {
//       done()
//     }
//   })
// // let sendEmail = await createTransporter()
// // sendEmail.sendMail(mailOptions, function (error, info) {
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
