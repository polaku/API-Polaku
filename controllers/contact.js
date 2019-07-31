const { tbl_contacts } = require('../models')

class news {
  static create(req, res) {
    let newData = {
      name: req.body.name,
      email: req.user.email,
      message: req.body.message,
      contact_categories_id: req.body.contactCategoriesId,
      company_id: req.body.company_id,
      user_id: req.user.user_id,
    }

    tbl_contacts.create(newData)
      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findAll(req, res) {
    tbl_contacts.findAll()
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_contacts.findByPk(Number(req.params.id))
      .then(data => {
        res.status(200).json(data)
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
        res.status(200).json({ info: "Delete Success" })
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
        where: { contact_id: Number(req.params.id) }
      }
    )
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

}

module.exports = news