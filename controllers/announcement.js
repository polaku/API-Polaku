const { tbl_announcements } = require('../models')

class announcements {
  static create(req, res) {
    let newData = {
      title: req.body.title,
      description: req.body.description,
      user_id: req.user.user_id,
      attachment: req.body.attachment,
      start_date: req.body.startDate,
      end_date: req.body.endDate
    }

    tbl_announcements.create(newData)
      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findAll(req, res) {
    tbl_announcements.findAll()
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_announcements.findByPk(Number(req.params.id))
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static delete(req, res) {
    tbl_announcements.destroy(
      { where: { announcements_id: req.params.id } }
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
    let newData = {
      title: req.body.title,
      description: req.body.description,
      attachment: req.body.attachment,
      start_date: req.body.startDate,
      end_date: req.body.endDate
    }

    tbl_announcements.update(newData, {
      where: { announcements_id: Number(req.params.id) }
    })
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

}

module.exports = announcements
