const { tbl_address_companies, tbl_operation_hours, tbl_photo_address, tbl_recess, tbl_companys, tbl_log_addresses, tbl_account_details, tbl_buildings, tbl_dinas, tbl_users, tbl_PICs, tbl_admin_companies } = require('../models')
const logError = require('../helpers/logError')
const { createDateAsUTC } = require('../helpers/convertDate');
const user = require('./user');
const Op = require('sequelize').Op

class address {
  static async create(req, res) {
    try {
      let building_id
      if (req.body.isMainAddress) {
        await tbl_address_companies.update({ is_main_address: 0 }, { where: { company_id: req.body.companyId } })
      }

      if (!req.body.building_id || req.body.building_id === 'null') {
        let newBuilding = {
          building: req.body.building,
          location_id: req.body.location_id || null,
          company_id: req.body.companyId,
          address: req.body.address,
          acronym: req.body.building,
        }
        let building = await tbl_buildings.create(newBuilding)

        building_id = building.building_id || building.null
      } else {
        building_id = req.body.building_id
      }

      let newAddress = {
        building_id,
        operationDay: req.body.operationalDay,
        company_id: req.body.companyId,
        phone: req.body.phone,
        fax: req.body.fax,
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

      res.setHeader('Cache-Control', 'no-cache');
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
      console.log(err)
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
      let condition = {}, query, conditionCompany = {}, conditionSearch = {}

      if (req.query.page) {
        let offset = +req.query.page, limit = +req.query.limit
        if (offset > 0) offset = offset * limit
        query = { offset, limit }
      }
      if (req.query.company) conditionCompany = { company_id: req.query.company }
      if (req.query.search) conditionSearch = { address: { [Op.substring]: req.query.search } }

      if (req.user.user_id !== 1 && !req.query.forOption) {
        // tbl_admin_companies

        // let userLogin = await tbl_users.findOne({ where: { user_id: req.user.user_id }, include: [{ as: 'dinas', model: tbl_dinas }, { model: tbl_account_details }] })

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
      }

      let data = await tbl_address_companies.findAll({
        ...query,
        where: { ...conditionCompany, ...condition },
        include: [
          {
            model: tbl_companys
          },
          {
            model: tbl_buildings,
            where: conditionSearch
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
            // jam istirahat
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

      let allData = await tbl_address_companies.findAll({
        where: { ...conditionCompany, ...condition },
        include: [
          {
            model: tbl_buildings,
            where: conditionSearch
          },
        ]
      })

      let allUser = await tbl_account_details.findAll()

      await data.forEach(async address => {
        let userInAddress = await allUser.filter(user => +user.company_id === +address.company_id && +user.building_id === +address.building_id)

        address.dataValues.totalEmployee = userInAddress.length || 0
      })

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: "Success", totalData: allData.length, data })
    } catch (err) {
      console.log(err)
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

      let newBuilding = {
        location_id: req.body.location_id,
        company_id: req.body.companyId,
        address: req.body.address,
        acronym: req.body.initial,
        phone: req.body.phone,
        fax: req.body.fax,
      }
      if (+req.body.building === 'NaN') newBuilding.building = req.body.building

      await tbl_buildings.update(newBuilding, { where: { building_id: req.body.building_id } })

      let newAddress = {
        building_id: req.body.building_id,
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

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: "Success" })

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

      res.setHeader('Cache-Control', 'no-cache');
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

        data = await tbl_log_addresses.findAll({
          where: {
            createdAt: {
              [Op.between]: [`${year}-${month}-01 00:00:00`, `${year}-${nextMonth}-01 00:00:00`]
            }
          },
          order: [['createdAt', 'DESC']]
        })
      } else {
        data = await tbl_log_addresses.findAll({ order: [['createdAt', 'DESC']] })
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
}

module.exports = address