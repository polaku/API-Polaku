const { tbl_designations, tbl_user_roles, tbl_menus, tbl_users, tbl_account_details } = require('../models')
const logError = require('../helpers/logError')
const { createDateAsUTC } = require('../helpers/convertDate');
const Op = require('sequelize').Op

class designation {
  static async create(req, res) {
    try {
      console.log(req.body)
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
      } else {
        await tbl_account_details.update({ designations_id: req.body.name }, { where: { user_id: req.body.userId } })
      }

      res.status(201).json({ message: 'Success' })
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

        data = await tbl_account_details.findAll({
          // ...query,
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
      console.log(req.params.userId)
      await tbl_account_details.update({ designations_id: null }, { where: { user_id: req.params.userId } })
      res.status(200).json({ message: "Delete Success", userId_deleted: req.params.id })
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

}

module.exports = designation