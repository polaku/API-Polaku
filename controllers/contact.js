const { tbl_contacts, tbl_account_details, tbl_users, tbl_contact_categories, tbl_categoris, tbl_companys, tbl_contact_comments } = require('../models')
const logError = require('../helpers/logError')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

class contact {
  static async create(req, res) {
    let newData, evalutor1 = 0, evalutor2 = 0

    let userAccountDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })

    if (Number(userAccountDetail.name_evaluator_1) !== NaN) evalutor1 = Number(userAccountDetail.name_evaluator_1)
    if (Number(userAccountDetail.name_evaluator_2) !== NaN) evalutor2 = Number(userAccountDetail.name_evaluator_2)

    newData = {
      name: userAccountDetail.fullname,
      email: req.user.email,
      message: req.body.message,
      contact_categories_id: req.body.contactCategoriesId,
      categori_id: req.body.categoriId,
      company_id: userAccountDetail.company_id,
      user_id: req.user.user_id,
      created_expired_date: new Date().setDate(new Date().getDate() + 1),
      subject: req.body.subject,
      type: req.body.type,
      design_style: req.body.designStyle,
      design_to: req.body.tujuan,
      design_type: req.body.desainType,
      design_size: req.body.ukuran,
      design_other_specs: req.body.otherSpecs,
      design_deadline: req.body.deadline,
      review: req.body.review,
      date_ijin_absen_start: req.body.date_ijin_absen_start,
      date_ijin_absen_end: req.body.date_ijin_absen_end,
      leave_request: req.body.leave_request,
      leave_date: req.body.leave_date,
      leave_date_in: req.body.leave_date_in,
      date_imp: req.body.date_imp,
      start_time_imp: req.body.start_time_imp,
      end_time_imp: req.body.end_time_imp,
      evaluator_1: evalutor1,
      evaluator_2: evalutor2,
    }

    tbl_contacts.create(newData)
      .then(async data => {
        let findNew = await tbl_contacts.findByPk(data.null)
        res.status(201).json({ message: "Success", data: findNew })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs`,
          method: 'post',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findAll(req, res) {
    tbl_contacts.findAll({
      where: {
        user_id: req.user.user_id,
        [Op.or]: [
          { status: 'new' },
          { status: 'new2' },
          { done_expired_date: { [Op.gte]: new Date() } }, //for contact_us
          { cancel_date: { [Op.gte]: new Date() } },
          { date_ijin_absen_start: { [Op.gte]: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-01` } },
          { date_imp: { [Op.gte]: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-01` } },
          { type: 'request', done_date: { [Op.gte]: new Date() } },
          { type: 'request', leave_date: { [Op.ne]: null } },
        ]
      },
      include: [
        {
          model: tbl_users, include: [{ model: tbl_account_details }]
        },
        { model: tbl_companys },
        {
          model: tbl_users, as: "evaluator1", include: [{ model: tbl_account_details }]
        },
        {
          model: tbl_users, as: "evaluator2", include: [{ model: tbl_account_details }]
        },
        { model: tbl_contact_categories },
        { model: tbl_categoris }],
      order: [
        ['created_at', 'DESC'],
        ['assigned_date', 'DESC'],
        ['taken_date', 'DESC'],
        ['done_date', 'DESC'],
        ['cancel_date', 'DESC'],
      ],
    })
      .then(data => {
        let newData = []
        data.forEach(element => {
          if (element.leave_date !== null) {
            let date = element.leave_date.split(',')
            date = date[date.length - 1]
            date = date.split(' ')
            if (date[0] >= `${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`) {
              newData.push(element)
            }
          } else {
            newData.push(element)
          }
        });
        res.status(200).json({ message: "Success", length: data.length, data: newData })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_contacts.findByPk(req.params.id, {
      include: [
        { model: tbl_users},
        { model: tbl_contact_categories },
        { model: tbl_categoris },
        { model: tbl_users, as: "evaluator1", include: [{ model: tbl_account_details }] },
        { model: tbl_users, as: "evaluator2", include: [{ model: tbl_account_details }] }]
    })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/${req.params.id}`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static delete(req, res) {
    tbl_contacts.destroy(
      { where: { contact_id: req.params.id } }
    )
      .then(() => {
        res.status(200).json({ info: "Delete Success", id_deleted: req.params.id })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/${req.params.id}`,
          method: 'delete',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static update(req, res) {

    tbl_contacts.update(
      {
        message: req.body.message,
        contact_categories_id: req.body.contactCategoriesId,
        categori_id: req.body.categoriId,
        user_id: req.user.user_id,
        subject: req.body.subject,
        type: req.body.type,
        design_style: req.body.designStyle,
        design_to: req.body.tujuan,
        design_type: req.body.desainType,
        design_size: req.body.ukuran,
        design_other_specs: req.body.otherSpecs,
        design_deadline: req.body.deadline,
        review: req.body.review,
        date_ijin_absen_start: req.body.date_ijin_absen_start,
        date_ijin_absen_end: req.body.date_ijin_absen_end,
        leave_request: req.body.leave_request,
        leave_date: req.body.leave_date,
        date_imp: req.body.date_imp,
        start_time_imp: req.body.start_time_imp,
        end_time_imp: req.body.end_time_imp,
        status: req.body.status
      }, {
      where: { contact_id: req.params.id }
    }
    )
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categoris }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/${req.params.id}`,
          method: 'patch',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static assigned(req, res) {
    tbl_contacts.update(
      {
        status: 'assigned',
        assigned_date: new Date(),
        assigned_expired_date: new Date().setHours(new Date().getHours() + 8),
        taken_by: req.user.user_id
      }, {
      where: { contact_id: req.params.id }
    }
    )
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categoris }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/assigned/${req.params.id}`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static taken(req, res) {
    tbl_contacts.update(
      {
        status: 'ongoing',
        taken_date: new Date()
      }, {
      where: { contact_id: req.params.id }
    }
    )
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categoris }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/taken/${req.params.id}`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static confirmation(req, res) {
    tbl_contacts.update(
      {
        status: 'confirmation',
        done_date: new Date(),
        done_expired_date: new Date().setDate(new Date().getDate() + 1)
      }, {
      where: { contact_id: req.params.id }
    }
    )
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categoris }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/confirmation/${req.params.id}`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static done(req, res) {
    tbl_contacts.update(
      {
        status: 'done',
      }, {
      where: { contact_id: req.params.id }
    }
    )
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categoris }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/done/${req.params.id}`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static cancel(req, res) {
    tbl_contacts.update(
      {
        status: 'cancel',
        cancel_date: new Date(),
        cancel_reason: req.body.reason
      }, {
      where: { contact_id: req.params.id }
    }
    )
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categoris }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/cancel/${req.params.id}`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findAllCategoris(req, res) {
    tbl_categoris.findAll()
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/categories`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findAllContactUs(req, res) {
    tbl_contacts.findAll({
      include: [
        { model: tbl_users, include: [{ model: tbl_account_details }] },
        { model: tbl_companys },
        { model: tbl_contact_categories },
        { model: tbl_categoris },
        { model: tbl_users, as: "evaluator1", include: [{ model: tbl_account_details }] },
        { model: tbl_users, as: "evaluator2", include: [{ model: tbl_account_details }] },],
      order: [
        ['created_at', 'DESC'],
        ['assigned_date', 'DESC'],
        ['taken_date', 'DESC'],
        ['done_date', 'DESC'],
        ['date_ijin_absen_start', 'DESC'],
        ['leave_date', 'DESC'],
        ['date_imp', 'DESC'],
      ],
    })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/allContactUs`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static async approved(req, res) {
    let contact = await tbl_contacts.findByPk(req.params.id)
    let newData = {
      status: req.body.status
    }

    if (!contact.evaluator_2 || req.body.status === 'approved') {
      if (contact.leave_request) {
        let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
        let sisaCuti = Number(userDetail.leave) - Number(contact.leave_request)

        await tbl_account_details.update({ leave: sisaCuti }, { where: { user_id: req.user.user_id } })
      }

      newData = {
        status: 'approved',
        done_date: new Date()
      }
    }

    tbl_contacts.update(
      newData, {
      where: { contact_id: req.params.id }
    })
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categoris }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/approved/${req.params.id}`,
          method: 'put',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static rejected(req, res) {
    tbl_contacts.update(
      {
        status: 'rejected',
      }, {
      where: { contact_id: req.params.id }
    }
    )
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categoris }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/rejected/${req.params.id}`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static discussion(req, res) {
    tbl_contact_comments.findAll({
      where: { contact_id: req.params.id },
      include: [{ model: tbl_users, include: [{ model: tbl_account_details }] }],
      order: [['created_at', 'DESC']]
    })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/discussion/${req.params.id}`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static createDiscussion(req, res) {
    let newData = {
      contact_id: req.body.contact_id,
      user_id: req.user.user_id,
      comment: req.body.comment
    }

    tbl_contact_comments.create(newData)
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/contactUs/discussion`,
          method: 'post',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
        console.log(err);
      })
  }

}


module.exports = contact