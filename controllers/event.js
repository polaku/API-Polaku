const { tbl_events, tbl_users, tbl_event_responses, tbl_account_details } = require('../models')

class event {
  static create(req, res) {
    let newData, startDate, endDate

    if (!req.body.event_name || !req.body.description || !req.body.start_date || !req.body.end_date || !req.body.location) {
      res.status(400).json({ error: 'Data not complite' })
    } else {
      startDate = req.body.start_date.split('-')
      endDate = req.body.end_date.split('-')

      if (Number(startDate[2]) > 31 || Number(startDate[2]) < 1 || Number(startDate[1]) > 12 || Number(startDate[1]) < 1 || Number(startDate[1]) < Number(new Date().getMonth() + 1) || Number(startDate[1]) == Number(new Date().getMonth() + 1) && Number(startDate[2]) < Number(new Date().getDate())) {
        res.status(400).json({ error: 'Start date invalid' })
      } else if (Number(endDate[2]) > 31 || Number(endDate[2]) < 1 || Number(endDate[1]) > 12 || Number(endDate[1]) < 1 || Number(endDate[1]) < Number(new Date().getMonth() + 1) || (Number(endDate[1]) == Number(new Date().getMonth() + 1) && Number(endDate[2]) < Number(new Date().getDate())) || Number(endDate[2]) < Number(startDate[2])) {
        res.status(400).json({ error: 'End date invalid' })
      } else {
        newData = {
          event_name: req.body.event_name,
          description: req.body.description,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          location: req.body.location,
          user_id: req.user.user_id,
        }

        if (req.file) newData.thumbnail = req.file.path

        tbl_events.create(newData)
          .then(async (data) => {
            console.log("YANG INI", data.null);
            let findNew = await tbl_events.findByPk(data.null)
            res.status(201).json({ message: "Success", data: findNew })

            let newData = {
              event_id: data.null,
              user_id: req.user.user_id,
              response: 'created' //join, not join, cancel join
            }

            await tbl_event_responses.create(newData)

          })
          .catch(err => {
            res.status(500).json({ err })
            console.log(err);
          })
      }
    }
  }

  static findAll(req, res) {
    tbl_events.findAll({
      include: [{
        model: tbl_users,
        include: [{ model: tbl_account_details }]
      }],
      order: [
        ['start_date', 'ASC'],
        ['created_at', 'DESC']
      ],
    })
      .then(data => {
        console.log(data);

        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err });
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_events.findByPk(req.params.id, {
      include: [{
        model: tbl_users,
        include: [{ model: tbl_account_details }]
      }]
    })
      .then(async (data) => {
        let user = tbl_users.findByPk(data.user_id)
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static delete(req, res) {
    tbl_events.destroy(
      { where: { event_id: req.params.id } }
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
    let newData

    if (!req.body.event_name || !req.body.description || !req.body.start_date || !req.body.end_date || !req.body.location) {
      res.status(400).json({ error: 'Data not complite' })
    } else {
      if (Number(startDate[2]) > 31 || Number(startDate[2]) < 1 || Number(startDate[1]) > 12 || Number(startDate[1]) < 1 || Number(startDate[1]) < Number(new Date().getMonth() + 1) || Number(startDate[1]) == Number(new Date().getMonth() + 1) && Number(startDate[2]) < Number(new Date().getDate())) {
        res.status(400).json({ error: 'Start date invalid' })
      } else if (Number(endDate[2]) > 31 || Number(endDate[2]) < 1 || Number(endDate[1]) > 12 || Number(endDate[1]) < 1 || Number(endDate[1]) < Number(new Date().getMonth() + 1) || (Number(endDate[1]) == Number(new Date().getMonth() + 1) && Number(endDate[2]) < Number(new Date().getDate())) || Number(endDate[2]) < Number(startDate[2])) {
        res.status(400).json({ error: 'End date invalid' })
      } else {
        newData = {
          event_name: req.body.event_name,
          description: req.body.description,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          location: req.body.location,
        }

        if (req.file) newData.thumbnail = req.file.path

        tbl_events.update(newData, {
          where: { event_id: req.params.id }
        })
          .then(async () => {
            let dataReturning = await tbl_events.findByPk(req.params.id, {
              include: [{
                model: tbl_users,
                include: [{ model: tbl_account_details }]
              }],
            })

            res.status(200).json({ message: "Success", data: dataReturning })
          })
          .catch(err => {
            res.status(500).json({ err })
            console.log(err);
          })
      }
    }
  }

  static findAllByMe(req, res) {
    tbl_events.findAll({
      where: { user_id: req.user.user_id },
      include: [{
        model: tbl_users,
        include: [{ model: tbl_account_details }]
      }],
      order: [
        ['start_date', 'ASC']
      ],
    })
      .then(async data => {
        let datas = await tbl_events.findAll({
          where: {
            user_id: req.user.user_id,
          },
          include: [{
            model: tbl_event_responses,
            where: {
              response: 'join',
              user_id: req.user.user_id,
            }
          }, {
            model: tbl_users,
            include: [{ model: tbl_account_details }]
          }]
        })
        res.status(200).json({ message: "Success", data, dataFollowing: datas })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static followEvent(req, res) {
    console.log(req.body.response);

    tbl_event_responses.findOne({
      where: {
        event_id: req.body.event_id,
        user_id: req.user.user_id,
      }
    })
      .then(data => {

        if (data && data.response === req.body.response) {
          res.status(201).json({ message: `You have ${req.body.response} this event` })
        } else if (data && data.response !== req.body.response) {
          tbl_event_responses.update({ response: req.body.response }, {
            where: {
              event_response_id: data.event_response_id,
            }
          })
            .then(data => {
              console.log(data);

              res.status(201).json({ message: "Success Change", data })
            })
        } else {
          if (req.body.response === 'join') {

            let newData = {
              event_id: req.body.event_id,
              user_id: req.user.user_id,
              response: req.body.response //join, not join, cancel join
            }
            tbl_event_responses.create(newData)
              .then(data => {
                res.status(201).json({ message: "Success Create", data })
              })
          }
        }
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

}

module.exports = event
