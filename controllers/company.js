const { tbl_companys } = require('../models')

class company {
  static findAll(req, res) {
    tbl_companys.findAll()
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err });
        console.log(err);
      })
  }
}

module.exports = company
