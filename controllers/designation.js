const { tbl_designations, tbl_user_roles, tbl_menus, tbl_users, tbl_account_details, tbl_dinas, tbl_log_admins, tbl_companys, tbl_PICs, tbl_admin_companies } = require('../models')
const logError = require('../helpers/logError')
const { createDateAsUTC } = require('../helpers/convertDate');
const Op = require('sequelize').Op

class designation {
  static async create(req, res) {
    try {
      let designation, designation_id
      if (isNaN(req.body.name)) {
        let createDesignation = await tbl_designations.create({ departments_id: req.body.departments_id || null, designations: req.body.name })
        // await tbl_account_details.update({ designations_id: createDesignation.designations_id || createDesignation.null }, { where: { user_id: req.body.userId } })
        designation_id = createDesignation.designations_id || createDesignation.null

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
        // await tbl_account_details.update({ designations_id: req.body.name }, { where: { user_id: req.body.userId } })
        designation_id = req.body.name

        let checkDesignation = await tbl_designations.findOne({ where: { designations_id: req.body.name } })
        designation = checkDesignation.designations

      }

      let checkPIC = await tbl_admin_companies.findOne({ where: { user_id: req.body.userId, company_id: req.body.companyId, PIC: 0, designations_id: designation_id } })
      if (!checkPIC) {
        let newDataAdmin = {
          user_id: req.body.userId,
          company_id: req.body.companyId,
          PIC: 0,
          designations_id: designation_id
        }
        if (req.body.notification_category_id) newDataAdmin.notification_category_id = req.body.notification_category_id

        await tbl_admin_companies.create(newDataAdmin)
      }

      // res.setHeader('Cache-Control', 'no-cache');
      res.status(201).json({ message: 'Success' })

      let userAdmin = await tbl_account_details.findOne({ where: { user_id: req.body.userId }, include: [{ as: 'tbl_company', model: tbl_companys }] })
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
          if (!req.query.company) {
            let userAdmin = await tbl_admin_companies.findAll({ where: { user_id: req.user.user_id } })

            let tempCondition = [], idCompany = []

            userAdmin && userAdmin.forEach(el => {
              if (idCompany.indexOf(el.company_id) === -1) {
                idCompany.push(el.company_id)
                tempCondition.push({
                  company_id: el.company_id,
                })
              }
            })

            condition = { [Op.or]: tempCondition }
          } else {
            condition = { company_id: req.query.company }
          }
        }

        // data = await tbl_account_details.findAll({
        //   ...query,
        //   where: { ...condition, ...conditionSearch },
        //   include: [
        //     {
        //       required: true,
        //       model: tbl_designations,
        //       include: [{
        //         model: tbl_user_roles
        //       }]
        //     }],
        //   order: [
        //     ['user_id', 'ASC']
        //   ]
        // })

        data = await tbl_users.findAll({
          ...query,
          attributes: {
            exclude: ['password']
          },
          include: [
            {
              // as: "tbl_account_detail", 
              model: tbl_account_details,
              where: conditionSearch,
              attributes: ['fullname', 'nik']
            },
            {
              required: true,
              model: tbl_admin_companies,
              where: { ...condition, PIC: 0 },
              include: [
                {
                  model: tbl_designations,
                  include: [{
                    model: tbl_user_roles
                  }]
                },
                {
                  model: tbl_companys,
                  attributes: ['company_id', 'acronym']
                }
              ]
            }],
          order: [
            ['user_id', 'ASC']
          ]
        })

        dataSelected = await tbl_users.findAll({
          attributes: {
            exclude: ['password']
          },
          include: [
            {
              // as: "tbl_account_detail", 
              model: tbl_account_details,
              where: conditionSearch,
              attributes: ['fullname', 'nik']
            },
            {
              required: true,
              model: tbl_admin_companies,
              where: { ...condition, PIC: 0 },
              include: [
                {
                  model: tbl_designations,
                  include: [{
                    model: tbl_user_roles
                  }]
                }
              ]
            }],
          order: [
            ['user_id', 'ASC']
          ]
        })
      }

      // res.setHeader('Cache-Control', 'no-cache');
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

      // res.setHeader('Cache-Control', 'no-cache');
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
      let checkAdmin = await tbl_admin_companies.findAll({ where: { user_id: req.params.id, PIC: 0 } })
      let checkUser = await tbl_account_details.findOne({ where: { user_id: req.params.id } })

      await tbl_admin_companies.destroy({ where: { user_id: req.params.id, PIC: 0 } })

      // res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: "Delete Success", userId_deleted: req.params.id })

      let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })

      if (checkAdmin.length > 0) {
        checkAdmin.forEach(async (el) => {
          let checkDesignation = await tbl_designations.findOne({ where: { designations_id: el.designations_id } })
          let company = await tbl_companys.findByPk(el.company_id)

          await tbl_log_admins.create({
            employee: checkUser.fullname,
            admin: checkDesignation ? checkDesignation.designations : '-',
            company: company ? company.company_name : '-',
            action: "DELETE",
            action_by: req.user.user_id + '-' + userDetail.fullname,
            createdAt: createDateAsUTC(new Date()),
            updatedAt: createDateAsUTC(new Date())
          })
        })
      }
    } catch (err) {
      console.log(err)
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

      // res.setHeader('Cache-Control', 'no-cache');
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

  static async changeRole(req, res) {
    try {
      let newData = {
        edited: req.body.role.edited,
        created: req.body.role.created,
        deleted: req.body.role.deleted
      }
      await tbl_user_roles.update(newData, { where: { user_role_id: req.params.id } })

      await tbl_admin_companies.update({ user_id: req.body.userId, company_id: req.body.companyId }, { where: { id: req.body.admin_companies_id } })

      // res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: "Success" })
    } catch (err) {
      console.log(err)
      let error = {
        uri: `http://api.polagroup.co.id/designation/role/${req.params.id}`,
        method: 'put',
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