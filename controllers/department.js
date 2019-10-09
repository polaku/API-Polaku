const { tbl_departments } = require('../models')

class department {
  static findAll(req, res) {
    tbl_departments.findAll()
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err });
        console.log(err);
      })
  }
}

module.exports = department
