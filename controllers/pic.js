const { tbl_PICs, tbl_companys, tbl_users, tbl_account_details } = require('../models');
const logError = require('../helpers/logError')

class pic {
  static async create(req, res) {
    try {
      let listPIC = req.body.pic || []

      let newData = {
        company_name: req.body.companyName,
        company_logo: 'http://api.polagroup.co.id/uploads/logo.png',
        acronym: req.body.akronim
      }
      let createCompany = await tbl_companys.create(newData)

      listPIC.length > 0 && listPIC.forEach(async el => {
        await tbl_PICs.create({ company_id: createCompany.null, user_id: el.user_id })
      })

      createCompany.company_id = createCompany.null
      res.status(201).json({ message: "Success", data: createCompany })
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
      let data = await tbl_companys.findAll({ include: [{ required: true, model: tbl_PICs, include: [{ model: tbl_users, include: [{ model: tbl_account_details }] }] }] })
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

  static async update(req, res) {
    try {
      let listPIC = req.body.pic || []
      let picCompany = await tbl_PICs.findAll({ where: { company_id: req.params.id } })

      console.log(picCompany)
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
      })
      res.status(201).json({ message: "Success" })
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
}

module.exports = pic