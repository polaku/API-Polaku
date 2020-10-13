const { tbl_address_companies, tbl_operation_hours, tbl_photo_address, tbl_recess, tbl_companys, tbl_log_addresses, tbl_account_details } = require('../models')
const logError = require('../helpers/logError')
const { createDateAsUTC } = require('../helpers/convertDate');
const Op = require('sequelize').Op

class address {
  static async create(req, res) {
    try {
      console.log(req.body)
      if (req.body.isMainAddress) {
        await tbl_address_companies.update({ is_main_address: 0 }, { where: { company_id: req.body.companyId } })
      }

      let newAddress = {
        address: req.body.address,
        acronym: req.body.initial,
        phone: req.body.phone,
        fax: req.body.fax,
        operationDay: req.body.operationalDay,
        company_id: req.body.companyId,
        is_main_address: req.body.isMainAddress,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      }

      let createAddress = await tbl_address_companies.create(newAddress)

      req.files.length > 0 && req.files.forEach(async element => {
        await tbl_photo_address.create({
          path: element.path,
          address_id: createAddress.id,
          createdAt: createDateAsUTC(new Date()),
          updatedAt: createDateAsUTC(new Date())
        })
      });

      if (Array.isArray(req.body.operationHours)) {
        req.body.operationHours.forEach(async element => {
          let temp = JSON.parse(element)
          let newHour = {
            day: temp.day,
            start: temp.startHour,
            end: temp.endHour,
            address_id: createAddress.id,
            createdAt: createDateAsUTC(new Date()),
            updatedAt: createDateAsUTC(new Date())
          }
          await tbl_operation_hours.create(newHour)
        });
      } else {
        let temp = JSON.parse(req.body.operationHours)
        let newHour = {
          day: temp.day,
          start: temp.startHour,
          end: temp.endHour,
          address_id: createAddress.id,
          createdAt: createDateAsUTC(new Date()),
          updatedAt: createDateAsUTC(new Date())
        }
        await tbl_operation_hours.create(newHour)
      }

      if (Array.isArray(req.body.operationRestHours)) {
        req.body.operationRestHours.forEach(async element => {
          let temp = JSON.parse(element)
          let newHour = {
            day: temp.day,
            start: temp.startRestHour,
            end: temp.endRestHour,
            address_id: createAddress.id,
            createdAt: createDateAsUTC(new Date()),
            updatedAt: createDateAsUTC(new Date())
          }
          await tbl_recess.create(newHour)
        });
      } else {
        let temp = JSON.parse(req.body.operationRestHours)
        let newHour = {
          day: temp.day,
          start: temp.startRestHour,
          end: temp.endRestHour,
          address_id: createAddress.id,
          createdAt: createDateAsUTC(new Date()),
          updatedAt: createDateAsUTC(new Date())
        }
        await tbl_recess.create(newHour)
      }
      res.status(201).json({ message: "Success" })

      let company = await tbl_companys.findByPk(req.body.companyId)
      let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
      await tbl_log_addresses.create({
        address: req.body.address,
        company: company.company_name,
        action: "CREATE",
        action_by: req.user.user_id + '-' + userDetail.fullname,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/address`,
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
      let data = await tbl_address_companies.findAll({
        include: [
          {
            model: tbl_companys
          },
          {
            model: tbl_photo_address,
            attributes: {
              exclude: ['updatedAt', 'updatedAt']
            },
          },
          {
            model: tbl_operation_hours,
            attributes: {
              exclude: ['updatedAt', 'updatedAt']
            },
          },
          {
            model: tbl_recess,
            attributes: {
              exclude: ['updatedAt', 'updatedAt']
            },
          },
        ],
        order: [
          ['updatedAt', 'DESC']
        ]
      })
      res.status(200).json({ message: "Success", data })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/address`,
        method: 'get',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err })
      console.log(err);
    }
  }

  static async update(req, res) {
    try {
      if (req.body.isMainAddress) {
        await tbl_address_companies.update({ is_main_address: 0 }, { where: { company_id: req.body.companyId } })
      }

      let newAddress = {
        address: req.body.address,
        acronym: req.body.initial,
        phone: req.body.phone,
        fax: req.body.fax,
        operationDay: req.body.operationalDay,
        company_id: req.body.companyId,
        is_main_address: req.body.isMainAddress,
        updatedAt: createDateAsUTC(new Date())
      }

      await tbl_address_companies.update(newAddress, { where: { id: req.params.id } })

      if (req.files.length > 0) {
        await tbl_photo_address.destroy({ where: { address_id: req.params.id } })

        req.files.forEach(async element => {
          await tbl_photo_address.create({ path: element.path, address_id: req.params.id })
        });
      }

      await tbl_operation_hours.destroy({ where: { address_id: req.params.id } })
      if (Array.isArray(req.body.operationHours)) {
        req.body.operationHours.forEach(async element => {
          let temp = JSON.parse(element)
          let newHour = {
            day: temp.day,
            start: temp.startHour,
            end: temp.endHour,
            address_id: req.params.id,
            createdAt: createDateAsUTC(new Date()),
            updatedAt: createDateAsUTC(new Date())
          }
          await tbl_operation_hours.create(newHour)
        });
      } else {
        let temp = JSON.parse(req.body.operationHours)
        let newHour = {
          day: temp.day,
          start: temp.startHour,
          end: temp.endHour,
          address_id: req.params.id,
          createdAt: createDateAsUTC(new Date()),
          updatedAt: createDateAsUTC(new Date())
        }
        await tbl_operation_hours.create(newHour)
      }

      await tbl_recess.destroy({ where: { address_id: req.params.id } })
      if (Array.isArray(req.body.operationRestHours)) {
        req.body.operationRestHours.forEach(async element => {
          let temp = JSON.parse(element)
          let newHour = {
            day: temp.day,
            start: temp.startRestHour,
            end: temp.endRestHour,
            address_id: req.params.id,
            createdAt: createDateAsUTC(new Date()),
            updatedAt: createDateAsUTC(new Date())
          }
          await tbl_recess.create(newHour)
        });
      } else {
        let temp = JSON.parse(req.body.operationRestHours)
        let newHour = {
          day: temp.day,
          start: temp.startRestHour,
          end: temp.endRestHour,
          address_id: req.params.id,
          createdAt: createDateAsUTC(new Date()),
          updatedAt: createDateAsUTC(new Date())
        }
        await tbl_recess.create(newHour)
      }
      res.status(201).json({ message: "Success" })

      let company = await tbl_companys.findByPk(req.body.companyId)
      let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
      await tbl_log_addresses.create({
        address: req.body.address,
        company: company.company_name,
        action: "UPDATE",
        action_by: req.user.user_id + '-' + userDetail.fullname,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/address/${req.params.id}`,
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
      let address = await tbl_address_companies.findByPk(req.params.id)

      await tbl_address_companies.destroy({ where: { id: req.params.id } })
      res.status(200).json({ message: "Delete Success", id_deleted: req.params.id })

      let company = await tbl_companys.findByPk(address.company_id)
      let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
      await tbl_log_addresses.create({
        address: address.address,
        company: company.company_name,
        action: "DELETE",
        action_by: req.user.user_id + '-' + userDetail.fullname,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/address/${req.params.id}`,
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
        console.log(`${year}-${month}-01 00:00:00`)
        console.log(`${year}-${nextMonth}-01 00:00:00`)
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

module.exports = address