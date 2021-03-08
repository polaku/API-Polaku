const { tbl_kritik_sarans } = require('../models')
const logError = require('../helpers/logError')

class kritikSaran {
  static async create(req, res) {
    let newData

    newData = {
      user_id: req.user.user_id,
      value: req.body.value,
    }

    tbl_kritik_sarans.create(newData)
      .then(async data => {
        res.setHeader('Cache-Control', 'no-cache');
        res.status(201).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs`,
          method: 'post',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findAll(req, res) {
    tbl_kritik_sarans.findAll()
      .then(data => {
        res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/kritikSaran`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err });
        console.log(err);
      })
  }
}

module.exports = kritikSaran
