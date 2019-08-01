const { tbl_polanews } = require('../models')

class news {
  static create(req, res) {
    let newData

    if (!req.body.title || !req.body.description) {
      res.status(400).json({ error: 'Data not complite' })
    } else {
      newData = {
        title: req.body.title,
        description: req.body.description,
        user_id: req.user.user_id,
        attachments: req.body.attachments,
        status: req.body.status
      }

      tbl_polanews.create(newData)
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
    tbl_polanews.findAll({ include: [{ model: tbl_users }] })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_polanews.findByPk(req.params.id, { include: [{ model: tbl_users }] })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static delete(req, res) {
    tbl_polanews.destroy(
      { where: { polanews_id: req.params.id } }
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
    let newData

    newData = {
      title: req.body.title,
      description: req.body.description,
      attachments: req.body.attachments,
      status: req.body.status
    }
    tbl_polanews.update(newData, {
      where: { polanews_id: req.params.id }
    })
      .then(async () => {
        let dataReturning = await tbl_polanews.findByPk(req.params.id, { include: [{ model: tbl_users }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

}

module.exports = news