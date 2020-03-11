const { tbl_polanews, tbl_users, tbl_account_details } = require('../models')
const logError = require('../helpers/logError')

class news {
  static create(req, res) {
    let newData, attachment, thumbnail
console.log("MASUK")
    if (req.files.length != 0) {
      attachment = req.files.find(el => el.mimetype === 'application/pdf')
      thumbnail = req.files.find(el => el.mimetype != 'application/pdf')
    }

    if (!req.body.title) {
      let error = {
        uri: `http://api.polagroup.co.id/news`,
        method: 'post',
        status: 400,
        message: 'Data not complite',
        user_id: req.user.user_id
      }
      logError(error)
      res.status(400).json({ error: 'Data not complite' })
    } else {
      newData = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        user_id: req.user.user_id,
        status: req.body.status
      }

      // if (attachment) newData.attachments = `http://api.polagroup.co.id/${attachment.path}`
      // if (thumbnail) newData.thumbnail = `http://api.polagroup.co.id/${thumbnail.path}`
      if (attachment) newData.attachments = `http://165.22.110.159/${attachment.path}`
      if (thumbnail) newData.thumbnail = `http://165.22.110.159/${thumbnail.path}`

      tbl_polanews.create(newData)
        .then(async data => {
          let findNew = await tbl_polanews.findByPk(data.null)
          res.status(201).json({ message: "Success", data: findNew })
        })
        .catch(err => {
          console.log(err);
          let error = {
            uri: `http://api.polagroup.co.id/news`,
            method: 'post',
            status: 500,
            message: err,
            user_id: req.user.user_id
          }
          logError(error)
          res.status(500).json({ err })
        })
    }
  }

  static findAll(req, res) {
    tbl_polanews.findAll({
      include: [{ model: tbl_users, include: [{ model: tbl_account_details }] }],
      order: [
        ['created_at', 'DESC']
      ],
    })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/news`,
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
    tbl_polanews.findByPk(req.params.id, { include: [{ model: tbl_users, include: [{ model: tbl_account_details }] }] })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/news/${req.params.id}`,
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
    tbl_polanews.destroy(
      { where: { polanews_id: req.params.id } }
    )
      .then(() => {
        res.status(200).json({ info: "Delete Success", id_deleted: req.params.id })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/news/${req.params.id}`,
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
    let newData, attachment, thumbnail

    if (req.files.length != 0) {
      attachment = req.files.find(el => el.mimetype === 'application/pdf')
      thumbnail = req.files.find(el => el.mimetype != 'application/pdf')
    }

    newData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status
    }

    // if (attachment) newData.attachments = `http://api.polagroup.co.id/${attachment.path}`
    // if (thumbnail) newData.thumbnail = `http://api.polagroup.co.id/${thumbnail.path}`
    if (attachment) newData.attachments = `http://165.22.110.159/${attachment.path}`
    if (thumbnail) newData.thumbnail = `http://165.22.110.159/${thumbnail.path}`

    tbl_polanews.update(newData, {
      where: { polanews_id: req.params.id }
    })
      .then(async () => {
        let dataReturning = await tbl_polanews.findByPk(req.params.id, { include: [{ model: tbl_users }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/news/${req.params.id}`,
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

module.exports = news