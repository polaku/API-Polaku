const { tbl_companys } = require('../models')
const logError = require('../helpers/logError')

class company {
  static findAll(req, res) {
    tbl_companys.findAll()
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/company`,
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

module.exports = company
