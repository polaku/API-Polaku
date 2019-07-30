const { tbl_polanews } = require('../models')

class news {
  static create(req, res) {
    tbl_polanews.create({
      title: req.body.title,
      description: req.body.description,
      created_by: '1',
      attachments: req.body.attachments,
      status: req.body.status
    })
      .then(({ dataValues }) => {
        res.status(201).json(dataValues)
      })
      .catch(err => {
        res.status(500).json({ err })

        console.log(err);
      })
  }

  static findAll(req, res) {
    tbl_polanews.findAll()
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_polanews.findByPk(Number(req.params.id))
      .then(data => {
        res.status(200).json(data)
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
        res.status(200).json({ info: "Delete Success" })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static update(req, res) {
    tbl_polanews.update(
      {
        title: req.body.title,
        description: req.body.description,
        attachments: req.body.attachments,
        status: req.body.status
      }, {
        where: { polanews_id: Number(req.params.id) }
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