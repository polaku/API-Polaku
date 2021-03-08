const { tbl_buildings } = require('../models')
const logError = require('../helpers/logError')

class building {
  static async findAll(req, res) {
    try {
      let data = await tbl_buildings.findAll()

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: "Success", data })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/address`,
        method: 'get',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err })
      console.log(err);
    }
  }
}

module.exports = building