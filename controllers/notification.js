const { tbl_notifications, tbl_users, tbl_account_details, tbl_department_positions, tbl_notification_categories, tbl_admin_companies, tbl_designations, tbl_user_roles, tbl_companys, tbl_structure_departments } = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const logError = require('../helpers/logError')

class notification {
  static async create(req, res) {
    try {
      let id_created = `${req.body.title}User${req.user.user_id}Date${Date()}`
      let newData = {
        title: req.body.title,
        description: req.body.description,
        from_user_id: req.user.user_id,
        created_at: new Date(),
        title: req.body.title,
        contact: req.body.contact,
        is_notif_polaku: req.body.is_notif_polaku,
        category_notification_id: req.body.category_notification_id,
        id_created
      }, promises = [];

      if (req.body.option === 'all') {
        let allUsers = await tbl_users.findAll({
          where: { activated: 1 },
          attributes: ['user_id', 'activated'],
          include: [
            {
              required: true,
              model: tbl_account_details,
              attributes: ['user_id'],
            }
          ]
        })

        allUsers.forEach(user => {
          console.log(user.user_id)
          newData.to_user_id = user.user_id

          promises.push(tbl_notifications.create(newData))
        })
      } else if (req.body.option === 'company') {
        await req.body.company.forEach(async (element) => {
          let allUsersInCompany = await tbl_structure_departments.findAll({
            where: { company_id: element.company_id },
            attributes: ['id', 'company_id'],
            include: [
              {
                model: tbl_department_positions,
                attributes: ['id', 'structure_department_id', 'user_id'],
              }
            ]
          })

          await allUsersInCompany.forEach(async (department) => {
            await department.tbl_department_positions.forEach(position => {
              if (position.user_id) {
                newData.to_user_id = position.user_id

                promises.push(tbl_notifications.create(newData))
              }
            })
          })
        });
      } else if (req.body.option === 'department') {
        await req.body.department.forEach(async (element) => {
          let allUsersInDepartment = await tbl_structure_departments.findAll({
            where: { departments_id: element.departments_id },
            attributes: ['id', 'departments_id'],
            include: [
              {
                model: tbl_department_positions,
                attributes: ['id', 'structure_department_id', 'user_id'],
              }
            ]
          })

          await allUsersInDepartment.forEach(async (department) => {
            await department.tbl_department_positions.forEach(position => {
              if (position.user_id) {
                newData.to_user_id = position.user_id

                promises.push(tbl_notifications.create(newData))
              }
            })
          })
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
    let condition = {}, query = {}

    if (req.query.page) {
      let offset = +req.query.page, limit = +req.query.limit
      if (offset > 0) offset = offset * limit
      query = { offset, limit }
    }

    console.log(req.query)
    if (req.query['is-notif-polaku']) {
      condition['is_notif_polaku'] = Number(req.query['is-notif-polaku'])
    }

    if (req.query['category-notification']) {
      condition['category_notification_id'] = Number(req.query['category-notification'])
    }

    console.log(query)

    tbl_notifications.findAll({
      where: {
        to_user_id: req.user.user_id,
        ...condition
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
        }, {
          model: tbl_notification_categories
        }
      ],
      order: [
        ['created_at', 'DESC']
      ],
      ...query
    })
      .then(data => {
        console.log(data.length)
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
      console.log(">>>",req.body.notifications_id)
      req.body.notifications_id.forEach(async element => {
        await tbl_notifications.update({ read_inline: 1, read: 1 }, { where: { notifications_id: element } })
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
      if (req.file) newData.icon = `${req.file.path}`

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

  static async findAllSettingCategory(req, res) {
    try {
      let data = await tbl_notification_categories.findAll({
        include: [
          {
            model: tbl_admin_companies,
            include: [
              {
                model: tbl_users,
                attributes: ['user_id'],
                include: [
                  {
                    model: tbl_account_details,
                    attributes: ['user_id', 'fullname'],
                  }
                ]
              }, {
                model: tbl_designations,
                include: [{
                  model: tbl_user_roles
                }]
              }, {
                model: tbl_companys
              }
            ]
          }
        ]
      })

      let newData = []
      await data.forEach(async el => {
        let tempAdmin = []
        await el.tbl_admin_companies.forEach(element => {
          console.log()
          tempAdmin.push({
            user_role_id: element.tbl_designation.tbl_user_roles[0].user_role_id,
            user_id: element.user_id,
            fullname: element.tbl_user.tbl_account_detail.fullname,
            admin_companies_id: element.id,
            company_id: element.company_id,
            created: element.tbl_designation.tbl_user_roles[0].created,
            edited: element.tbl_designation.tbl_user_roles[0].edited,
            deleted: element.tbl_designation.tbl_user_roles[0].deleted,
            company: element.tbl_company
          })
        })

        newData.push({
          createdAt: el.createdAt,
          icon: el.icon,
          id: el.id,
          name: el.name,
          updatedAt: el.updatedAt,
          user_id: el.user_id,
          admin: tempAdmin,
        })
      })

      res.status(200).json({ message: 'Success', data: newData })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

  static async findAlCategory(req, res) {
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
