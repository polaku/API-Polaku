const { tbl_users, tbl_activity_logins, tbl_account_details } = require('../models')
const logError = require('../helpers/logError')

class security {
  static findAllLogin(req, res) {
    tbl_users.findAll({
      attributes: {
        exclude: ['password']
      },
      include: [
        {
          // as: "tbl_account_detail", 
          model: tbl_account_details, attributes: ['fullname', 'avatar', 'nik', 'company_id', 'initial']
        },
        { require: true, model: tbl_activity_logins, where: { status: 1 } }
      ]
    })
      .then(data => {
        // res.setHeader('Cache-Control', 'no-cache');
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

module.exports = security
