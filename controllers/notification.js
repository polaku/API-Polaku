const { tbl_notifications, tbl_users } = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const logError = require('../helpers/logError')

class notification {
  static findAll(req, res) {
    tbl_notifications.findAll({
      where: {
        to_user_id: req.user.user_id,
        // [Op.or]: [{ read: 0, read_inline: 0 }, { read: 0, urgent: 1 }]
      },
      include: [
        {
          model: tbl_users,
          attributes: {
            exclude: ['password']
          },
          as: 'from_user'
        },
        {
          model: tbl_users,
          attributes: {
            exclude: ['password']
          },
          as: 'to_user'
        }
      ],
      order: [
        ['created_at', 'DESC']
      ],
    })
      .then(data => {
        // res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/notification`,
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

  static updateReadInline(req, res) {

    try {
      req.body.notifications_id.forEach(async element => {
        await tbl_notifications.update({ read_inline: 1 }, { where: { notifications_id: element } })
      });

      // res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: "Success" })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/notification`,
        method: 'put',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err);
    }
  }

  static updateRead(req, res) {

    tbl_notifications.update({ read: req.body.read }, { where: { notifications_id: req.params.id } })
      .then(() => {
        // res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json({ message: "Success", notifications_id: req.params.id })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/notification/${req.params.id}`,
          method: 'put',
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

module.exports = notification
