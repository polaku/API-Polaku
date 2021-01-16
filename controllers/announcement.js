const { tbl_announcements, tbl_users, tbl_account_details } = require('../models')
const logError = require('../helpers/logError')

class announcement {
  static create(req, res) {
    let startDate, endDate, newData, attachment, thumbnail
    if (req.files.length != 0) {
      attachment = req.files.find(el => el.mimetype === 'application/pdf')
      thumbnail = req.files.find(el => el.mimetype != 'application/pdf')
    }

    if (!req.body.title || !req.body.description || !req.body.startDate || !req.body.endDate) {
      let error = {
        uri: 'http://api.polagroup.co.id/announcement',
        method: 'post',
        status: 400,
        message: 'Data not complite',
        user_id: req.user.user_id
      }
      logError(error)
      res.status(400).json({ error: 'Data not complite' })
    } else {
      startDate = req.body.startDate
      endDate = req.body.endDate

      if (new Date(startDate).getDate() > 31 || new Date(startDate).getDate() < 1 || new Date(startDate).getMonth() + 1 > 12 || new Date(startDate).getMonth() + 1 < 1 || new Date(startDate).getMonth() + 1 < Number(new Date().getMonth() + 1) || new Date(startDate).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(startDate).getDate() < Number(new Date().getDate())) {
        let error = {
          uri: 'http://api.polagroup.co.id/announcement',
          method: 'post',
          status: 400,
          message: 'Start date invalid',
          user_id: req.user.user_id
        }
        logError(error)
        res.status(400).json({ error: 'Start date invalid' })
      } else if (new Date(endDate).getDate() > 31 || new Date(endDate).getDate() < 1 || new Date(endDate).getMonth() + 1 > 12 || new Date(endDate).getMonth() + 1 < 1 || new Date(endDate).getMonth() + 1 < Number(new Date().getMonth() + 1) || (new Date(endDate).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(endDate).getDate() < Number(new Date().getDate())) || new Date(endDate).getDate() < new Date(startDate).getDate()) {
        let error = {
          uri: 'http://api.polagroup.co.id/announcement',
          method: 'post',
          status: 400,
          message: 'End date invalid',
          user_id: req.user.user_id
        }
        logError(error)
        res.status(400).json({ error: 'End date invalid' })
      } else {
        today()

        if (Number(today) >= Number(startDate.join(''))) {
          let error = {
            uri: 'http://api.polagroup.co.id/announcement',
            method: 'post',
            status: 400,
            message: 'Start date invalid',
            user_id: req.user.user_id
          }
          logError(error)
          res.status(400).json({ error: 'Start date invalid' })
        } else if (Number(startDate.join('')) >= Number(endDate.join(''))) {
          let error = {
            uri: 'http://api.polagroup.co.id/announcement',
            method: 'post',
            status: 400,
            message: 'End date invalid',
            user_id: req.user.user_id
          }
          logError(error)
          res.status(400).json({ error: 'End date invalid' })
        } else {
          newData = {
            title: req.body.title,
            description: req.body.description,
            user_id: req.user.user_id,
            start_date: req.body.startDate,
            end_date: req.body.endDate
          }

          // if (attachment) newData.attachment = `http://api.polagroup.co.id/${attachment.path}`
          // if (thumbnail) newData.thumbnail = `http://api.polagroup.co.id/${thumbnail.path}`

          if (attachment) newData.attachment = `http://165.22.110.159/${attachment.path}`
          if (thumbnail) newData.thumbnail = `http://165.22.110.159/${thumbnail.path}`

          tbl_announcements.create(newData)
            .then(async data => {
              let findNew = await tbl_announcements.findByPk(data.null)
              res.status(201).json({ message: "Success", data: findNew })
            })
            .catch(err => {
              let error = {
                uri: 'http://api.polagroup.co.id/announcement',
                method: 'post',
                status: 500,
                message: err,
                user_id: req.user.user_id
              }
              logError(error)
              res.status(500).json({ message: "error", err })
              console.log(err);
            })
        }
      }
    }
  }

  static findAll(req, res) {
    tbl_announcements.findAll({
      include: [{
        model: tbl_users,
        include: [{
          // as: "tbl_account_detail", 
          model: tbl_account_details
        }]
      }],
      order: [
        ['announcements_id', 'DESC']
      ]
    })
      .then(async data => {
        if (req.query.page === 1) data = data.slice(0, 10)
        else data = data.slice(((req.query.page - 1) * 10), (req.query.page * 10))

        let dataPilihan = await tbl_announcements.findAll({
          where: { highlight: 1 },
          include: [{
            model: tbl_users,
            include: [{
              //  as: "tbl_account_detail", 
              model: tbl_account_details
            }]
          }],
          order: [
            ['announcements_id', 'DESC']
          ]
        })

        res.status(200).json({ message: "Success", data, dataPilihan })
      })
      .catch(err => {
        let error = {
          uri: 'http://api.polagroup.co.id/announcement',
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_announcements.findByPk(req.params.id, {
      include: [{
        model: tbl_users,
        include: [{
          // as: "tbl_account_detail",
          model: tbl_account_details
        }]
      }]
    })
      .then(async data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: 'http://api.polagroup.co.id/announcement',
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
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
        let error = {
          uri: `http://api.polagroup.co.id/announcement/${req.params.id}`,
          method: 'delete',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static update(req, res) {
    let startDate, endDate, newData, attachment, thumbnail
    if (req.files.length != 0) {
      attachment = req.files.find(el => el.mimetype === 'application/pdf')
      thumbnail = req.files.find(el => el.mimetype != 'application/pdf')
    }

    if (!req.body.title || !req.body.description || !req.body.startDate || !req.body.endDate) {
      let error = {
        uri: `http://api.polagroup.co.id/announcement/${req.params.id}`,
        method: 'put',
        status: 400,
        message: 'Data not complite',
        user_id: req.user.user_id
      }
      logError(error)
      res.status(400).json({ error: 'Data not complite' })
    } else {
      startDate = req.body.startDate
      endDate = req.body.endDate

      if (new Date(startDate).getDate() > 31 || new Date(startDate).getDate() < 1 || new Date(startDate).getMonth() + 1 > 12 || new Date(startDate).getMonth() + 1 < 1 || new Date(startDate).getMonth() + 1 < Number(new Date().getMonth() + 1) || new Date(startDate).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(startDate).getDate() < Number(new Date().getDate())) {
        let error = {
          uri: `http://api.polagroup.co.id/announcement/${req.params.id}`,
          method: 'put',
          status: 400,
          message: 'Start date invalid',
          user_id: req.user.user_id
        }
        logError(error)
        res.status(400).json({ error: 'Start date invalid' })
      } else if (new Date(endDate).getDate() > 31 || new Date(endDate).getDate() < 1 || new Date(endDate).getMonth() + 1 > 12 || new Date(endDate).getMonth() + 1 < 1 || new Date(endDate).getMonth() + 1 < Number(new Date().getMonth() + 1) || (new Date(endDate).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(endDate).getDate() < Number(new Date().getDate())) || new Date(endDate).getDate() < new Date(startDate).getDate()) {
        let error = {
          uri: `http://api.polagroup.co.id/announcement/${req.params.id}`,
          method: 'put',
          status: 400,
          message: 'Start date invalid',
          user_id: req.user.user_id
        }
        logError(error)
        res.status(400).json({ error: 'End date invalid' })
      } else {
        today()

        if (Number(today) >= Number(startDate.join(''))) {
          let error = {
            uri: `http://api.polagroup.co.id/announcement/${req.params.id}`,
            method: 'put',
            status: 400,
            message: 'Start date invalid',
            user_id: req.user.user_id
          }
          logError(error)
          res.status(400).json({ error: 'Start date invalid' })
        } else if (Number(startDate.join('')) >= Number(endDate.join(''))) {
          let error = {
            uri: `http://api.polagroup.co.id/announcement/${req.params.id}`,
            method: 'put',
            status: 400,
            message: 'End date invalid',
            user_id: req.user.user_id
          }
          logError(error)
          res.status(400).json({ error: 'End date invalid' })
        } else {
          newData = {
            title: req.body.title,
            description: req.body.description,
            start_date: req.body.startDate,
            end_date: req.body.endDate
          }

          // if (attachment) newData.attachment = `http://api.polagroup.co.id/${attachment.path}`
          // if (thumbnail) newData.thumbnail = `http://api.polagroup.co.id/${thumbnail.path}`
          if (attachment) newData.attachment = `http://165.22.110.159/${attachment.path}`
          if (thumbnail) newData.thumbnail = `http://165.22.110.159/${thumbnail.path}`


          tbl_announcements.update(newData, {
            where: { announcements_id: req.params.id }, returning: true
          })
            .then(async () => {
              let dataReturning = await tbl_announcements.findByPk(req.params.id, {
                include: [{
                  model: tbl_users,
                  include: [{
                    // as: "tbl_account_detail",
                    model: tbl_account_details
                  }]
                }]
              })

              res.status(200).json({ message: "Success", data: dataReturning })
            })
            .catch(err => {
              let error = {
                uri: `http://api.polagroup.co.id/announcement/${req.params.id}`,
                method: 'put',
                status: 500,
                message: err,
                user_id: req.user.user_id
              }
              logError(error)
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

module.exports = announcement
