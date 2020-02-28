const { tbl_positions } = require('../models')
const logError = require('../helpers/logError')

class department {
  static findAll(req, res) {
    tbl_positions.findAll()
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/department`,
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

module.exports = department
