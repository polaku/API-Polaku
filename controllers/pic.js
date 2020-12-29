const { tbl_PICs, tbl_companys, tbl_users, tbl_account_details, tbl_admin_companies } = require('../models');
const logError = require('../helpers/logError')

class pic {
  static async create(req, res) {
    try {
      let listPIC = req.body.pic || [], companyId, data

      let checkAvailableCompany = await tbl_companys.findOne({ where: { company_name: req.body.companyName } })
      if (!checkAvailableCompany) {
        let newData = {
          company_name: req.body.companyName,
          company_logo: 'http://api.polagroup.co.id/uploads/logo.png',
          acronym: req.body.akronim
        }
        let createCompany = await tbl_companys.create(newData)
        companyId = createCompany.null

        data = createCompany
        data.company_id = createCompany.null
      } else {
        companyId = checkAvailableCompany.company_id
        data = checkAvailableCompany
      }

      listPIC.length > 0 && listPIC.forEach(async el => {
        await tbl_PICs.create({ company_id: companyId, user_id: el.user_id })

        let checkPIC = await tbl_admin_companies.findOne({ where: { user_id: el.user_id, company_id: companyId, PIC: 1 } })
        if (!checkPIC) {
          await tbl_admin_companies.create({ user_id: el.user_id, company_id: companyId, PIC: 1 })
        }
      })

      res.status(201).json({ message: "Success", data })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/pic`,
        method: 'create',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err);
    }
  }

  static async findAll(req, res) {
    try {
      let data = await tbl_companys.findAll({
        include: [{
          required: true,
          model: tbl_PICs,
          include: [{
            model: tbl_users,
            include: [{
              // as: "tbl_account_detail", 
              model: tbl_account_details
            }]
          }]
        }]
      })
      res.status(200).json({ message: "Success", data })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/pic`,
        method: 'create',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err);
    }
  }

  static async update(req, res) {
    try {
      let listPIC = req.body.pic || []
      let picCompany = await tbl_PICs.findAll({ where: { company_id: req.params.id } })

      picCompany.forEach(async pic => {
        let check = listPIC.find(el => el.user_id === pic.user_id)
        if (!check) {
          await tbl_PICs.destroy({ where: { id: pic.id } })
        }
      })

      listPIC.forEach(async el => {
        let check = picCompany.find(pic => pic.user_id === el.user_id)
        if (!check) {
          await tbl_PICs.create({ company_id: req.params.id, user_id: el.user_id })
        }

        let checkPIC = await tbl_admin_companies.findOne({ where: { user_id: el.user_id, company_id: req.params.id, PIC: 1 } })
        if (!checkPIC) {
          await tbl_admin_companies.create({ user_id: el.user_id, company_id: req.params.id, PIC: 1 })
        }
      })
      res.status(200).json({ message: "Success" })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/pic`,
        method: 'update',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err);
    }
  }

  static async delete(req, res) {
    try {
      let PIC_deleted = await tbl_PICs.findOne({ where: { id: req.params.id } })

      await tbl_PICs.destroy({ where: { id: req.params.id } })
      await tbl_admin_companies.destroy({ where: { user_id: PIC_deleted.user_id, company_id: PIC_deleted.company_id, PIC: 1 } })

      res.status(200).json({ message: "Success" })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/pic`,
        method: 'delete',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err);
    }
  }
}

module.exports = pic