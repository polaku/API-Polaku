const { tbl_notifications, tbl_users, tbl_account_details, tbl_department_positions, tbl_notification_categories } = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const logError = require('../helpers/logError')

class notification {
  static async create(req, res) {
    try {
      let newData = {
        title: req.body.title,
        description: req.body.description,
        from_user_id: req.user.user_id,
        created_at: new Date(),
        title: req.body.title,
        contact: req.body.contact,
        is_notif_polaku: req.body.is_notif_polaku,
        category_notification_id: req.body.category_notification_id
      }, promises = [];

      if (req.body.option === 'all') {
        newData.is_for_all = req.body.is_for_all;

        promises.push(tbl_notifications.create(newData))
      } else if (req.body.option === 'company') {
        await req.body.company.forEach(element => {
          newData.company_id = element.company_id;
          promises.push(tbl_notifications.create(newData))
        });
      } else if (req.body.option === 'department') {
        await req.body.department.forEach(async (element) => {
          newData.departments_id = element.departments_id;
          promises.push(tbl_notifications.create(newData))
        });
      }
      await Promise.all(promises)

      res.status(200).json({ message: "Success" })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

  static async findAll(req, res) {
    let accountDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })

    tbl_notifications.findAll({
      where: {
        [Op.or]: [
          { to_user_id: req.user.user_id },
          { to_user_id: req.user.user_id },
        ]
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


  static async createCategory(req, res) {
    try {
      let newData = {
        name: req.body.name,
        user_id: req.user.user_id
      }
      if (req.file) newData.icon = `http://165.22.110.159/${req.file.path}`

      let data = await tbl_notification_categories.create(newData)

      res.status(201).json({ message: 'Success', data })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

  static async editCategory(req, res) {
    try {
      let newData = {
        name: req.body.name
      }
      if (req.file) newData.icon = `uploads/${req.file.path}`

      await tbl_notification_categories.update(newData, { where: { id: req.params.id } })

      res.status(201).json({ message: 'Success' })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

  static async deleteCategory(req, res) {
    try {
      await tbl_notification_categories.destroy({ where: { id: req.params.id } })

      res.status(201).json({ message: 'Success', idDeleted: req.params.id })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

  static async findAllCategory(req, res) {
    try {
      let data = await tbl_notification_categories.findAll()

      res.status(200).json({ message: 'Success', data })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }
}

module.exports = notification
