const { tbl_eventss } = require('../models')

class news {
  static create(req, res) {
    tbl_events.create({
      event_name: req.body.event_name,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      location: req.body.location,
      thumbnail: req.body.thumbnail,
      user_id: '1',
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
    tbl_events.findAll()
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_events.findByPk(Number(req.params.id))
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static delete(req, res) {
    tbl_events.destroy(
      { where: { event_id: req.params.id } }
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
    tbl_events.update(
      {
        event_name: req.body.event_name,
        description: req.body.description,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        location: req.body.location,
        thumbnail: req.body.thumbnail,
      }, {
        where: { event_id: Number(req.params.id) }
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
