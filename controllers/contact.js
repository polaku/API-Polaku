const { tbl_contacts, tbl_account_details } = require('../models')

class news {
  static async create(req, res) {
    let newData

    if (!req.user.email || !req.body.message || !req.body.contactCategoriesId || !req.body.company_id) {
      res.status(400).json({ error: 'Data not complite' })
    } else {
      let nameUser = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
      newData = {
        name: nameUser.fullname,
        email: req.user.email,
        message: req.body.message,
        contact_categories_id: req.body.contactCategoriesId,
        company_id: req.body.company_id,
        user_id: req.user.user_id,
      }

      tbl_contacts.create(newData)
        .then(data => {
          res.status(201).json({ message: "Success", data })
        })
        .catch(err => {
          res.status(500).json({ err })
          console.log(err);
        })
    }
  }

  static findAll(req, res) {
    tbl_contacts.findAll({ include: [{ model: tbl_users }] })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }] })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static delete(req, res) {
    tbl_contacts.destroy(
      { where: { contact_id: req.params.id } }
    )
      .then(() => {
        res.status(200).json({ info: "Delete Success", id_deleted: req.params.id })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static update(req, res) {
    tbl_contacts.update(
      {
        status: req.body.status
      }, {
        where: { contact_id: req.params.id }
      }
    )
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

}

module.exports = news