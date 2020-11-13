const { tbl_designations, tbl_user_roles, tbl_menus, tbl_users, tbl_account_details, tbl_dinas, tbl_log_admins, tbl_companys } = require('../models')
const logError = require('../helpers/logError')
const { createDateAsUTC } = require('../helpers/convertDate');
const Op = require('sequelize').Op

class designation {
  static async create(req, res) {
    try {
      console.log(req.body)
      let designation
      if (isNaN(req.body.name)) {
        let createDesignation = await tbl_designations.create({ departments_id: req.body.departments_id || null, designations: req.body.name })

        await tbl_account_details.update({ designations_id: createDesignation.designations_id || createDesignation.null }, { where: { user_id: req.body.userId } })

        req.body.roles.length > 0 && req.body.roles.forEach(async (element) => {
          await tbl_user_roles.create({
            designations_id: createDesignation.designations_id || createDesignation.null,
            menu_id: element.menuId,
            view: element.view,
            created: element.created,
            edited: element.edited,
            deleted: element.deleted,
            download: element.download
          })
        });

        designation = req.body.name
      } else {
        await tbl_account_details.update({ designations_id: req.body.name }, { where: { user_id: req.body.userId } })

        let checkDesignation = await tbl_designations.findOne({ where: { designations_id: req.body.name } })
        designation = checkDesignation.designations
      }

      res.status(201).json({ message: 'Success' })

      let userAdmin = await tbl_account_details.findOne({ where: { user_id: req.body.userId }, include: [{ model: tbl_companys }] })
      let userDinas = await tbl_dinas.findAll({ where: { user_id: req.body.userId }, include: [{ model: tbl_companys }] })
      let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })

      await tbl_log_admins.create({
        employee: userAdmin.fullname,
        admin: designation,
        company: userAdmin.tbl_company.company_name,
        action: "CREATE",
        action_by: req.user.user_id + '-' + userDetail.fullname,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      })

      userDinas.length > 0 && userDinas.forEach(async (el) => {
        await tbl_log_admins.create({
          employee: userAdmin.fullname,
          admin: designation,
          company: el.tbl_company.company_name,
          action: "CREATE",
          action_by: req.user.user_id + '-' + userDetail.fullname,
          createdAt: createDateAsUTC(new Date()),
          updatedAt: createDateAsUTC(new Date())
        })
      })
    } catch (err) {
      console.log(err)
      let error = {
        uri: `http://api.polagroup.co.id/designation`,
        method: 'post',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err })
      console.log(err);
    }
  }

  static async findAll(req, res) {
    try {
      let query = {}, condition = {}, conditionSearch = {}, data, dataSelected

      if (req.query.option) {
        data = await tbl_designations.findAll({
          include: [{
            model: tbl_user_roles
          }]
        })
        dataSelected = data
      } else {
        if (req.query.page) {
          let offset = +req.query.page, limit = +req.query.limit
          if (offset > 0) offset = offset * limit
          query = { offset, limit }
        }
        if (req.query.status) condition = { status_employee: req.query.status }

        if (req.query.search) {
          conditionSearch = {
            [Op.or]: [
              { fullname: { [Op.substring]: req.query.search } },
              { nik: { [Op.substring]: req.query.search } },
            ]
          }
        }

        if (req.user.user_id !== 1) {
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

        data = await tbl_account_details.findAll({
          ...query,
          where: { ...condition, ...conditionSearch },
          include: [
            {
              required: true,
              model: tbl_designations,
              include: [{
                model: tbl_user_roles
              }]
            }],
          order: [
            ['user_id', 'ASC']
          ]
        })

        dataSelected = await tbl_account_details.findAll({
          where: { ...condition, ...conditionSearch },
          include: [
            {
              required: true,
              model: tbl_designations,
              include: [{
                model: tbl_user_roles
              }]
            }],
          order: [
            ['user_id', 'ASC']
          ]
        })
      }

      res.status(200).json({ message: "Success", totalRecord: dataSelected.length, data })
    } catch (err) {
      console.log(err);
      let error = {
        uri: `http://api.polagroup.co.id/designation`,
        method: 'get',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err })
    }
  }

  // static async update(req, res) {
  //   try {
  //     let newDinas = {
  //       building_id: req.body.buildingId || null,
  //       company_id: req.body.companyId || null,
  //       evaluator_id: req.body.evaluatorId || null,
  //       user_id: req.body.userId || null,
  //     }
  //     await tbl_dinas.update(newDinas, { where: { id: req.params.id } })

  //     res.status(201).json({ message: "Success" })
  //   } catch (err) {
  //     let error = {
  //       uri: `http://api.polagroup.co.id/designation/${req.params.id}`,
  //       method: 'post',
  //       status: 500,
  //       message: err,
  //       user_id: req.user.user_id
  //     }
  //     logError(error)
  //     res.status(500).json({ err })
  //   }
  // }

  static async delete(req, res) {
    try {
      await tbl_designations.destroy({ where: { designations_id: req.params.id } })
      await tbl_user_roles.destroy({ where: { designations_id: req.params.id } })
      res.status(200).json({ message: "Delete Success", id_deleted: req.params.id })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/designation/${req.params.id}`,
        method: 'delete',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err })
    }
  }

  static async deleteUser(req, res) {
    try {
      let checkUser = await tbl_account_details.findOne({ where: { user_id: req.params.userId } })
      let checkDesignation = await tbl_designations.findOne({ where: { designations_id: checkUser.designations_id } })

      console.log(req.params.userId)
      await tbl_account_details.update({ designations_id: null }, { where: { user_id: req.params.userId } })
      res.status(200).json({ message: "Delete Success", userId_deleted: req.params.id })


      let company = await tbl_companys.findByPk(checkUser.company_id)
      let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
      await tbl_log_admins.create({
        employee: checkUser.fullname,
        admin: checkDesignation.designations,
        company: company.company_name,
        action: "DELETE",
        action_by: req.user.user_id + '-' + userDetail.fullname,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/designation/${req.params.id}`,
        method: 'delete',
        status: 500,
        message: err,
        user_id: req.user.user_id
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

        data = await tbl_log_admins.findAll({
          where: {
            createdAt: {
              [Op.between]: [`${year}-${month}-01 00:00:00`, `${year}-${nextMonth}-01 00:00:00`]
            }
          },
          order: [['createdAt', 'DESC']]
        })
      } else {
        data = await tbl_log_admins.findAll({ order: [['createdAt', 'DESC']] })
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

module.exports = designation