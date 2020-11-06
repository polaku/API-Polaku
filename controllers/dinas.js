const { tbl_dinas, tbl_companys, tbl_account_details, tbl_buildings, tbl_users } = require('../models')
const logError = require('../helpers/logError')
const { createDateAsUTC } = require('../helpers/convertDate');
const Op = require('sequelize').Op

class dinas {
  static async create(req, res) {
    try {
      let newDinas = {
        building_id: req.body.buildingId,
        company_id: req.body.companyId,
        evaluator_id: req.body.evaluatorId || null,
        user_id: req.body.userId,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      }
      await tbl_dinas.create(newDinas)

      res.status(201).json({ message: "Success" })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/dinas`,
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
      let query = {}, condition = {}, conditionSearch = {}

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

      let data = await tbl_users.findAll({
        ...query,
        include: [
          {
            required: true,
            as: 'dinas',
            model: tbl_dinas,
            include: [{
              model: tbl_companys
            }, {
              model: tbl_buildings
            }, {
              as: 'evaluator',
              model: tbl_users,
              include: [{
                model: tbl_account_details,
              }]
            }]
          }, {
            model: tbl_account_details,
            where: { ...condition, ...conditionSearch },
            attributes: ['fullname', 'status_employee', 'nik']
          }],
        order: [
          ['user_id', 'ASC']
        ]
      })

      let dataSelected = await tbl_users.findAll({
        where: { user_id: { [Op.ne]: 1 } },
        include: [{
          required: true,
          as: 'dinas',
          model: tbl_dinas,
        }, {
          required: true,
          model: tbl_account_details,
          where: { ...condition, ...conditionSearch },
        }]
      })

      let allData = await tbl_users.findAll({
        where: { user_id: { [Op.ne]: 1 } },
        include: [{
          required: true,
          model: tbl_account_details
        }]
      })

      let tetap = 0, kontrak = 0, probation = 0, berhenti = 0

      await allData.forEach(user => {
        if (user.tbl_account_detail && user.tbl_account_detail.status_employee !== null && user.tbl_account_detail.status_employee.toLowerCase() === 'tetap') tetap++
        else if (user.tbl_account_detail && user.tbl_account_detail.status_employee !== null && user.tbl_account_detail.status_employee.toLowerCase() === 'kontrak') kontrak++
        else if (user.tbl_account_detail && user.tbl_account_detail.status_employee !== null && user.tbl_account_detail.status_employee.toLowerCase() === 'probation') probation++
        else if ((user.tbl_account_detail && user.tbl_account_detail.status_employee !== null && user.tbl_account_detail.status_employee.toLowerCase() === 'berhenti') || !user.activated) berhenti++
      })

      res.status(200).json({ message: "Success", totalRecord: dataSelected.length, allUser: allData.length, tetap, kontrak, probation, berhenti, data })
    } catch (err) {
      console.log(err);
      let error = {
        uri: `http://api.polagroup.co.id/dinas`,
        method: 'get',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err })
    }
  }

  static async update(req, res) {
    try {
      let newDinas = {
        building_id: req.body.buildingId || null,
        company_id: req.body.companyId || null,
        evaluator_id: req.body.evaluatorId || null,
        user_id: req.body.userId || null,
      }
      await tbl_dinas.update(newDinas, { where: { id: req.params.id } })

      res.status(201).json({ message: "Success" })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/dinas/${req.params.id}`,
        method: 'post',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err })
    }
  }

  static async delete(req, res) {
    try {
      await tbl_dinas.destroy({ where: { id: req.params.id } })
      res.status(200).json({ message: "Delete Success", id_deleted: req.params.id })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/dinas/${req.params.id}`,
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
      await tbl_dinas.destroy({ where: { user_id: req.params.userId } })
      res.status(200).json({ message: "Delete Success", userId_deleted: req.params.id })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/dinas/user/${req.params.id}`,
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

        data = await tbl_log_addresses.findAll({
          where: {
            // [Op.and]: {
            //   createdAt: {
            //     [Op.gte]: `${year}-${month}-01 00:00:00`
            //   },
            //   createdAt: {
            //     [Op.lte]: `${year}-${nextMonth}-01 00:00:00`
            //   },
            // }
            createdAt: {
              [Op.between]: [`${year}-${month}-01 00:00:00`, `${year}-${nextMonth}-01 00:00:00`]
            }
          },
          order: [['createdAt', 'DESC']]
        })
        // where: { date_in: { [Op.gte]: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` } },
      } else {
        data = await tbl_log_addresses.findAll({ order: [['createdAt', 'DESC']] })
      }
      res.status(200).json({ message: "Success", data })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/dinas/log`,
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

module.exports = dinas