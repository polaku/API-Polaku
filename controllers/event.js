const { tbl_events } = require('../models')

class news {
  static create(req, res) {
    let newData, startDate, endDate

    if (!req.body.event_name || !req.body.description || !req.body.start_date || !req.body.end_date || !req.body.location || !req.body.thumbnail) {
      res.status(400).json({ error: 'Data not complite' })
    } else {
      startDate = req.body.start_date.split('-')
      endDate = req.body.end_date.split('-')

      if (Number(startDate[2]) > 31 || Number(startDate[2]) < 1 || Number(startDate[1]) > 12 || Number(startDate[1]) < 1 || Number(startDate[1]) < Number(new Date().getMonth() + 1) || Number(startDate[1]) == Number(new Date().getMonth() + 1) && Number(startDate[2]) < Number(new Date().getDate())) {
        res.status(400).json({ error: 'Start date invalid' })
      } else if (Number(endDate[2]) > 31 || Number(endDate[2]) < 1 || Number(endDate[1]) > 12 || Number(endDate[1]) < 1 || Number(endDate[1]) < Number(new Date().getMonth() + 1) || (Number(endDate[1]) == Number(new Date().getMonth() + 1) && Number(endDate[2]) < Number(new Date().getDate())) || Number(endDate[2]) < Number(startDate[2])) {
        res.status(400).json({ error: 'End date invalid' })
      } else {

        newData = {
          event_name: req.body.event_name,
          description: req.body.description,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          location: req.body.location,
          thumbnail: req.body.thumbnail,
          user_id: req.user.user_id,
        }

        tbl_events.create(newData)
          .then(data => {
            res.status(201).json({ message: "Success", data })
          })
          .catch(err => {
            res.status(500).json({ err })
            console.log(err);
          })
      }
    }
  }

  static findAll(req, res) {
    tbl_events.findAll({ include: [{ model: tbl_users }] })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_events.findByPk(req.params.id, { include: [{ model: tbl_users }] })
      .then(data => {
        res.status(200).json({ message: "Success", data })
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
        res.status(200).json({ info: "Delete Success", id_deleted: req.params.id })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static update(req, res) {
    let newData

    if (!req.body.event_name || !req.body.description || !req.body.start_date || !req.body.end_date || !req.body.location || !req.body.thumbnail) {
      res.status(400).json({ error: 'Data not complite' })
    } else {
      if (Number(startDate[2]) > 31 || Number(startDate[2]) < 1 || Number(startDate[1]) > 12 || Number(startDate[1]) < 1 || Number(startDate[1]) < Number(new Date().getMonth() + 1) || Number(startDate[1]) == Number(new Date().getMonth() + 1) && Number(startDate[2]) < Number(new Date().getDate())) {
        res.status(400).json({ error: 'Start date invalid' })
      } else if (Number(endDate[2]) > 31 || Number(endDate[2]) < 1 || Number(endDate[1]) > 12 || Number(endDate[1]) < 1 || Number(endDate[1]) < Number(new Date().getMonth() + 1) || (Number(endDate[1]) == Number(new Date().getMonth() + 1) && Number(endDate[2]) < Number(new Date().getDate())) || Number(endDate[2]) < Number(startDate[2])) {
        res.status(400).json({ error: 'End date invalid' })
      } else {
        newData = {
          event_name: req.body.event_name,
          description: req.body.description,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          location: req.body.location,
          thumbnail: req.body.thumbnail,
        }

        tbl_events.update(newData, {
          where: { event_id: req.params.id }
        })
          .then(async () => {
            let dataReturning = await tbl_events.findByPk(req.params.id, { include: [{ model: tbl_users }] })

            res.status(200).json({ message: "Success", data: dataReturning })
          })
          .catch(err => {
            res.status(500).json({ err })
            console.log(err);
          })
      }
    }
  }

}

module.exports = news
