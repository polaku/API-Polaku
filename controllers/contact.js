const { tbl_contacts, tbl_account_details, tbl_users, tbl_contact_categories, tbl_categories } = require('../models')

class contact {
  static async create(req, res) {
    let newData

    let nameUser = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
    console.log(nameUser);

    console.log(req.body)

    newData = {
      name: nameUser.fullname,
      email: req.user.email,
      message: req.body.message,
      contact_categories_id: req.body.contactCategoriesId,
      categori_id: req.body.categoriId,
      company_id: nameUser.company_id,
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
    }

    tbl_contacts.create(newData)
      .then(async data => {
        let findNew = await tbl_contacts.findByPk(data.null)
        res.status(201).json({ message: "Success", data: findNew })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findAll(req, res) {
    tbl_contacts.findAll({
      where: { user_id: req.user.user_id },
      include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categories }],
      order: [
        ['created_at', 'DESC'],
        ['assigned_date', 'DESC'],
        ['taken_date', 'DESC'],
        ['done_date', 'DESC'],
        ['cancel_date', 'DESC'],
      ],
    })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categories }] })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
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
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static update(req, res) {
    tbl_contacts.update(
      {
        status: req.body.status
      }, {
      where: { contact_id: req.params.id }
    }
    )
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categories }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static assigned(req, res) {
    tbl_contacts.update(
      {
        status: 'assigned',
        assigned_date: new Date(),
        assigned_expired_date: new Date().setHours(new Date().getHours() + 8)
      }, {
      where: { contact_id: req.params.id }
    }
    )
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categories }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static taken(req, res) {
    tbl_contacts.update(
      {
        status: 'ongoing',
        taken_by: req.params.taken_by,
        taken_date: new Date()
      }, {
      where: { contact_id: req.params.id }
    }
    )
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categories }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
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
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categories }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
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
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categories }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static cancel(req, res) {
    tbl_contacts.update(
      {
        status: 'cancel',
        cancel_date: new Date()
      }, {
      where: { contact_id: req.params.id }
    }
    )
      .then(async () => {
        let dataReturning = await tbl_contacts.findByPk(req.params.id, { include: [{ model: tbl_users }, { model: tbl_contact_categories }, { model: tbl_categories }] })

        res.status(200).json({ message: "Success", data: dataReturning })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findAllCategories(req, res) {
    tbl_categories.findAll()
      .then(data => {
        res.status(200).json({ message: "Success11", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

}

module.exports = contact