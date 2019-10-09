const { tbl_notifications, tbl_users } = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

class notification {
  static findAll(req, res) {
    tbl_notifications.findAll({
      where: {
        to_user_id: req.user.user_id,
        // [Op.or]: [{ read: 0, read_inline: 0 }, { read: 0, urgent: 1 }]
      },
      include: [
        { model: tbl_users, as: 'from_user' },
        { model: tbl_users, as: 'to_user' }
      ],
      order: [
        ['created_at', 'DESC']
      ],
    })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err });
        console.log(err);
      })
  }

  static updateReadInline(req, res) {

    console.log(req.body.notifications_id)
    try {
      req.body.notifications_id.forEach(async element => {
        let a = await tbl_notifications.update({ read_inline: 1 }, { where: { notifications_id: element } })
        console.log(a)
      });
      res.status(200).json({ message: "Success" })
    } catch (err) {
      res.status(500).json({ err });
      console.log(err);
    }
  }

  static updateRead(req, res) {

    tbl_notifications.update({ read: req.body.read }, { where: { notifications_id: req.params.id } })
      .then(() => {
        res.status(200).json({ message: "Success", notifications_id: req.params.id })
      })
      .catch(err => {
        res.status(500).json({ err });
        console.log(err);
      })
  }
}

module.exports = notification
