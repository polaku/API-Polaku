const { tbl_announcements, tbl_users } = require('../models')

class announcements {
  static create(req, res) {
    let startDate, endDate, newData

    if (!req.body.title || !req.body.description || !req.body.attachment || !req.body.startDate || !req.body.endDate) {
      res.status(400).json({ error: 'Data not complite' })
    } else {
      startDate = req.body.startDate.split('-')
      endDate = req.body.endDate.split('-')

      if (Number(startDate[2]) > 31 || Number(startDate[2]) < 1 || Number(startDate[1]) > 12 || Number(startDate[1]) < 1 || Number(startDate[1]) < Number(new Date().getMonth() + 1) || Number(startDate[1]) == Number(new Date().getMonth() + 1) && Number(startDate[2]) < Number(new Date().getDate())) {
        res.status(400).json({ error: 'Start date invalid' })
      } else if (Number(endDate[2]) > 31 || Number(endDate[2]) < 1 || Number(endDate[1]) > 12 || Number(endDate[1]) < 1 || Number(endDate[1]) < Number(new Date().getMonth() + 1) || (Number(endDate[1]) == Number(new Date().getMonth() + 1) && Number(endDate[2]) < Number(new Date().getDate())) || Number(endDate[2]) < Number(startDate[2])) {
        res.status(400).json({ error: 'End date invalid' })
      } else {
        today()

        if (Number(today) >= Number(startDate.join(''))) {
          res.status(400).json({ error: 'Start date invalid' })
        } else if (Number(startDate.join('')) >= Number(endDate.join(''))) {
          res.status(400).json({ error: 'End date invalid' })
        } else {
          newData = {
            title: req.body.title,
            description: req.body.description,
            user_id: req.user.user_id,
            attachment: req.body.attachment,
            start_date: req.body.startDate,
            end_date: req.body.endDate
          }

          tbl_announcements.create(newData)
            .then(data => {
              res.status(201).json({ message: "Success", data })
            })
            .catch(err => {
              res.status(500).json({ message: "error", err })
              console.log(err);
            })
        }
      }
    }
  }

  static findAll(req, res) {
    tbl_announcements.findAll({ include: [{ model: tbl_users }] })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_announcements.findByPk(req.params.id, { include: [{ model: tbl_users }] })
      .then(async data => {
        console.log(data);
        res.status(200).json({ message: "Success", data })
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
        res.status(200).json({ message: "Delete Success", id_deleted: req.params.id })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static update(req, res) {
    let startDate, endDate, newData

    if (!req.body.title || !req.body.description || !req.body.attachment || !req.body.startDate || !req.body.endDate) {
      res.status(400).json({ error: 'Data not complite' })
    } else {
      startDate = req.body.startDate.split('-')
      endDate = req.body.endDate.split('-')

      if (Number(startDate[2]) > 31 || Number(startDate[2]) < 1 || Number(startDate[1]) > 12 || Number(startDate[1]) < 1 || Number(startDate[1]) < Number(new Date().getMonth() + 1) || Number(startDate[1]) == Number(new Date().getMonth() + 1) && Number(startDate[2]) < Number(new Date().getDate())) {
        res.status(400).json({ error: 'Start date invalid' })
      } else if (Number(endDate[2]) > 31 || Number(endDate[2]) < 1 || Number(endDate[1]) > 12 || Number(endDate[1]) < 1 || Number(endDate[1]) < Number(new Date().getMonth() + 1) || (Number(endDate[1]) == Number(new Date().getMonth() + 1) && Number(endDate[2]) < Number(new Date().getDate())) || Number(endDate[2]) < Number(startDate[2])) {
        res.status(400).json({ error: 'End date invalid' })
      } else {
        today()

        if (Number(today) >= Number(startDate.join(''))) {
          res.status(400).json({ error: 'Start date invalid' })
        } else if (Number(startDate.join('')) >= Number(endDate.join(''))) {
          res.status(400).json({ error: 'End date invalid' })
        } else {
          newData = {
            title: req.body.title,
            description: req.body.description,
            attachment: req.body.attachment,
            start_date: req.body.startDate,
            end_date: req.body.endDate
          }

          tbl_announcements.update(newData, {
            where: { announcements_id: req.params.id }, returning: true
          })
            .then(async () => {
              let dataReturning = await tbl_announcements.findByPk(req.params.id, { include: [{ model: tbl_users }] })

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

}

function today() {
  let date, month

  date = new Date().getDate()
  month = new Date().getMonth() + 1
  if (date < 10) {
    date = '0' + date
  }
  if (month < 10) {
    month = '0' + month
  }
  return `${new Date().getFullYear()}${month}${date}`
}

module.exports = announcements
