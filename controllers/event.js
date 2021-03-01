const { tbl_events, tbl_users, tbl_event_responses, tbl_account_details, tbl_master_creators, tbl_event_invites, tbl_department_positions, tbl_structure_departments, tbl_notifications, tbl_companys, tbl_departments } = require('../models')
const { mailOptions, createTransporter, transporter } = require('../helpers/nodemailer')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const logError = require('../helpers/logError')

class event {
  static async create(req, res) {
    let newData, startDate, endDate, eventName, createdBy

    if (!req.body.event_name || !req.body.description || !req.body.start_date || !req.body.end_date) {
      let error = {
        uri: `http://api.polagroup.co.id/events`,
        method: 'post',
        status: 400,
        message: 'Data not complite',
        user_id: req.user.user_id
      }
      logError(error)
      res.status(400).json({ error: 'Data not complite' })
    } else {
      startDate = req.body.start_date
      endDate = req.body.end_date

      if (new Date(startDate).getDate() > 31 || new Date(startDate).getDate() < 1 || new Date(startDate).getMonth() + 1 > 12 || new Date(startDate).getMonth() + 1 < 1 || new Date(startDate).getMonth() + 1 < Number(new Date().getMonth() + 1) || new Date(startDate).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(startDate).getDate() < Number(new Date().getDate())) {
        let error = {
          uri: `http://api.polagroup.co.id/events`,
          method: 'post',
          status: 400,
          message: 'Start date invalid',
          user_id: req.user.user_id
        }
        logError(error)
        res.status(400).json({ error: 'Start date invalid' })
      } else if (new Date(endDate).getDate() > 31 || new Date(endDate).getDate() < 1 || new Date(endDate).getMonth() + 1 > 12 || new Date(endDate).getMonth() + 1 < 1 || new Date(endDate).getMonth() + 1 < Number(new Date().getMonth() + 1) || (new Date(endDate).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(endDate).getDate() < Number(new Date().getDate())) || new Date(endDate).getDate() < new Date(startDate).getDate()) {
        let error = {
          uri: `http://api.polagroup.co.id/events`,
          method: 'post',
          status: 400,
          message: 'End date invalid',
          user_id: req.user.user_id
        }
        logError(error)
        res.status(400).json({ error: 'End date invalid' })
      } else {
        newData = {
          event_name: req.body.event_name,
          description: req.body.description,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          location: req.body.location,
          user_id: req.user.user_id,
          status: 1
        }

        eventName = req.body.event_name, createdBy = req.user.user_id

        // if (req.file) newData.thumbnail = `http://api.polagroup.co.id/${req.file.path}`
        if (req.file) newData.thumbnail = `http://165.22.110.159/${req.file.path}`

        tbl_events.create(newData)
          .then(async (data) => {
            let findNew = await tbl_events.findByPk(data.null)
            res.status(201).json({ message: "Success", data: findNew })

            let newData = {
              event_id: data.null,
              user_id: req.user.user_id,
              response: 'created', //join, not join, cancel join
              creator: 1
            }

            await tbl_event_responses.create(newData)

            try {
              if (req.body.option === 'default') {
                let dataCreator = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
                let newData = {
                  event_id: data.null,
                  option: 'company',
                  company_id: dataCreator.company_id
                }
                await tbl_event_invites.create(newData)

              } else if (req.body.option === 'all') {
                let newData = {
                  event_id: data.null,
                  option: 'all',
                }
                await tbl_event_invites.create(newData)
              } else if (req.body.option === 'company') {
                req.body.invited = JSON.parse(req.body.invited)
                req.body.invited.forEach(async element => {
                  let newData = {
                    event_id: data.null,
                    option: 'company',
                    company_id: element
                  }
                  await tbl_event_invites.create(newData)
                });
              } else if (req.body.option === 'department') {
                req.body.invited = JSON.parse(req.body.invited)
                req.body.invited.forEach(async element => {
                  let newData = {
                    event_id: data.null,
                    option: 'department',
                    departments_id: element
                  }
                  await tbl_event_invites.create(newData)
                });
              } else if (req.body.option === 'user') {
                req.body.invited = JSON.parse(req.body.invited)
                req.body.invited.forEach(async element => {
                  let newData = {
                    event_id: data.null,
                    option: 'user',
                    user_id: element
                  }
                  await tbl_event_invites.create(newData)
                });
              }
              sendEmail(eventName, req.body.option, req.body.invited, req.user.user_id)

            } catch (err) {
              console.log(err)
            }
          })
          .catch(err => {
            let error = {
              uri: `http://api.polagroup.co.id/events`,
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
  }

  static async findAll(req, res) {
    let tempConditionPT = [], tempConditionDepartment = [], condition = {}
    if (req.user.user_id !== 1) {
      let userAccount = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
      let dataPosition = await tbl_department_positions.findAll({ where: { user_id: req.user.user_id }, include: [{ model: tbl_structure_departments }] })

      tempConditionPT.push({
        [Op.and]: [
          { option: 'company' },
          { company_id: userAccount.company_id },
        ]
      })

      dataPosition.length > 0 && await dataPosition.forEach(position => {
        tempConditionPT.push({
          [Op.and]: [
            { option: 'company' },
            { company_id: position.tbl_structure_department.company_id },
          ]
        })

        tempConditionDepartment.push({
          [Op.and]: [
            { option: 'department' },
            { departments_id: position.tbl_structure_department.departments_id },
          ]
        })
      })

      condition = {
        [Op.or]: [
          { option: 'all' },
          {
            [Op.and]: [
              { option: 'user' },
              { user_id: req.user.user_id },
            ]
          },
          ...tempConditionPT,
          ...tempConditionDepartment
        ]
      }
    }

    tbl_events.findAll({
      where: {
        end_date: { [Op.gte]: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-01` },
        status: 1
      },
      include: [{
        model: tbl_users,
        include: [{
          // as: "tbl_account_detail",
          model: tbl_account_details
        }]
      },
      {
        model: tbl_event_invites,
        where: condition
      }],
      order: [
        ['start_date', 'ASC'],
        ['created_at', 'DESC']
      ],
    })
      .then(data => {
        res.status(200).json({ message: "Success", total_record: data.length, data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/events`,
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

  static findAllEvent(req, res) {
    tbl_events.findAll({
      where: {
        start_date: { [Op.gte]: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}` },
      },
      include: [{
        model: tbl_users,
        include: [{
          // as: "tbl_account_detail",
          model: tbl_account_details
        }]
      }],
      order: [
        ['start_date', 'ASC'],
        ['created_at', 'DESC']
      ],
    })
      .then(data => {
        res.status(200).json({ message: "Success", total_record: data.length, data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/events/all`,
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

  static findOne(req, res) {
    tbl_events.findByPk(req.params.id, {
      include: [{
        model: tbl_users,
        include: [{
          // as: "tbl_account_detail",
          model: tbl_account_details
        }]
      }]
    })
      .then(async (data) => {
        let eventInvited = await tbl_event_invites.findAll({
          where: { event_id: req.params.id },
          include: [
            { model: tbl_companys },
            { model: tbl_departments },
            {
              model: tbl_users,
              include: [{
                // as: "tbl_account_detail",
                model: tbl_account_details
              }]
            }]
        })
        res.status(200).json({ message: "Success", data, eventInvited })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/events/${req.params.id}`,
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

  static async delete(req, res) {
    try {
      await tbl_events.destroy(
        { where: { event_id: req.params.id } }
      )
      await tbl_event_responses.destroy(
        { where: { event_id: req.params.id } }
      )
      await tbl_event_invites.destroy(
        { where: { event_id: req.params.id } }
      )

      res.status(200).json({ info: "Delete Success", id_deleted: req.params.id })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/events/${req.params.id}`,
        method: 'delete',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err })
      console.log(err);
    }

  }

  static update(req, res) {
    let newData
    let startDate = req.body.start_date
    let endDate = req.body.end_date

    if (!req.body.event_name || !req.body.description || !req.body.start_date || !req.body.end_date || !req.body.location) {
      let error = {
        uri: `http://api.polagroup.co.id/events/${req.params.id}`,
        method: 'put',
        status: 400,
        message: 'Data not complite',
        user_id: req.user.user_id
      }
      logError(error)
      res.status(400).json({ error: 'Data not complite' })
    } else {
      if (new Date(startDate).getDate() > 31 || new Date(startDate).getDate() < 1 || new Date(startDate).getMonth() + 1 > 12 || new Date(startDate).getMonth() + 1 < 1 || new Date(startDate).getMonth() + 1 < Number(new Date().getMonth() + 1) || new Date(startDate).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(startDate).getDate() < Number(new Date().getDate())) {
        let error = {
          uri: `http://api.polagroup.co.id/events/${req.params.id}`,
          method: 'put',
          status: 400,
          message: 'Start date invalid',
          user_id: req.user.user_id
        }
        logError(error)
        res.status(400).json({ error: 'Start date invalid' })
      } else if (new Date(endDate).getDate() > 31 || new Date(endDate).getDate() < 1 || new Date(endDate).getMonth() + 1 > 12 || new Date(endDate).getMonth() + 1 < 1 || new Date(endDate).getMonth() + 1 < Number(new Date().getMonth() + 1) || (new Date(endDate).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(endDate).getDate() < Number(new Date().getDate())) || new Date(endDate).getDate() < new Date(startDate).getDate()) {
        let error = {
          uri: `http://api.polagroup.co.id/events/${req.params.id}`,
          method: 'put',
          status: 400,
          message: 'End date invalid',
          user_id: req.user.user_id
        }
        logError(error)
        res.status(400).json({ error: 'End date invalid' })
      } else {
        newData = {
          event_name: req.body.event_name,
          description: req.body.description,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          location: req.body.location,
        }

        // if (req.file) newData.thumbnail = `http://api.polagroup.co.id/${req.file.path}`
        if (req.file) newData.thumbnail = `http://165.22.110.159/${req.file.path}`

        tbl_events.update(newData, {
          where: { event_id: req.params.id }
        })
          .then(async () => {
            let dataReturning = await tbl_events.findByPk(req.params.id, {
              include: [{
                model: tbl_users,
                include: [{
                  // as: "tbl_account_detail",
                  model: tbl_account_details
                }]
              }],
            })

            res.status(200).json({ message: "Success", data: dataReturning })
          })
          .catch(err => {
            let error = {
              uri: `http://api.polagroup.co.id/events/${req.params.id}`,
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
    }
  }

  static findAllByMe(req, res) {
    tbl_events.findAll({
      where: { user_id: req.user.user_id, status: 1 },
      include: [{
        model: tbl_users,
        include: [{
          // as: "tbl_account_detail",
          model: tbl_account_details
        }]
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
            include: [{
              // as: "tbl_account_detail",
              model: tbl_account_details
            }]
          }]
        })
        res.status(200).json({ message: "Success", data, dataFollowing: datas })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/events/myevents`,
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

  static followEvent(req, res) {
    tbl_event_responses.findOne({
      where: {
        event_id: req.body.event_id,
        user_id: req.user.user_id,
      }
    })
      .then(data => {
        if (data && data.response === req.body.response) {
          let error = {
            uri: `http://api.polagroup.co.id/events/follow`,
            method: 'post',
            status: 304,
            message: `The user had ${req.body.response} this event`,
            user_id: req.user.user_id
          }
          logError(error)
          res.status(304).json({ message: `You had ${req.body.response} this event` })
        } else if (data && data.response !== req.body.response) {
          tbl_event_responses.update({ response: req.body.response }, {
            where: {
              event_response_id: data.event_response_id,
            }
          })
            .then(async () => {
              let findNew = await tbl_events.findByPk(req.body.event_id)

              res.status(200).json({ message: "Success Change", data: findNew })
            })
        } else {
          if (req.body.response === 'join') {
            let newData = {
              event_id: req.body.event_id,
              user_id: req.user.user_id,
              response: req.body.response //join, not join, cancel join
            }
            tbl_event_responses.create(newData)
              .then(async data => {
                let findNew = await tbl_event_responses.findByPk(data.null)
                res.status(201).json({ message: "Success Create", data: findNew })
              })
          }
        }
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/events/follow`,
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

  static approvalEvent(req, res) {
    tbl_events.update({ status: req.body.status }, {
      where: {
        event_id: req.params.id,
      }
    })
      .then(async data => {
        let creator = await tbl_events.findByPk(req.params.id)
        let dataEventInvite = await tbl_event_invites.findAll({ where: { event_id: req.params.id } })

        res.status(200).json({ message: "Success Change", data: creator })

        // if (dataEventInvite[0].option === 'company') {
        //   dataEventInvite.forEach(async element => {
        //     let paraPegawai = await tbl_account_details.findAll({ where: { company_id: element.company_id } })
        //     await paraPegawai.forEach(pegawai => {
        //       tbl_users.findByPk(pegawai.user_id)
        //         .then(async ({ dataValues }) => {

        //           let newDes = creator.event_name.split(" ")
        //           if (newDes.length > 3) {
        //             newDes = newDes.slice(0, 3).join(" ") + '...'
        //           } else {
        //             newDes = newDes.join(" ")
        //           }
        //           let newData = {
        //             description: newDes,
        //             from_user_id: req.user.user_id,
        //             to_user_id: dataValues.user_id,
        //             value: "Event",
        //             link: `/event/detailEvent/${createEvent.null}`,
        //           }
        //           await tbl_notifications.create(newData)

        //           if (dataValues.email !== '-') {
        //             mailOptions.subject = "There's new Event!"
        //             mailOptions.to = dataValues.email
        //             mailOptions.html = `Dear , <br/><br/>Hai ada acara baru nih <b>${creator.event_name}.`

        //             // let sendEmail = await createTransporter()
        //             // sendEmail.sendMail(mailOptions, function (error, info) {
        //             transporter.sendMail(mailOptions, function (error, info) {
        //               if (error) {
        //                 let error = {
        //                   uri: `http://api.polagroup.co.id/events/approvalEvent/${req.params.id}`,
        //                   method: 'put',
        //                   status: 0,
        //                   message: `Send email to ${dataValues.email} is error`,
        //                   user_id: req.user.user_id
        //                 }
        //                 logError(error)
        //               }
        //             })
        //           }
        //         })
        //         .catch(err => {
        //           console.log(err)
        //         })
        //     });
        //   });
        // } else if (dataEventInvite[0].option === 'department') {
        //   dataEventInvite.forEach(async element => {
        //     let paraPegawai = await tbl_account_details.findAll({
        //       include: [{
        //         model: tbl_designations,
        //         where: { departments_id: element.departments_id }
        //       }, {
        //         model: tbl_users
        //       }]
        //     })
        //     await paraPegawai.forEach(async pegawai => {
        //       if (pegawai.tbl_user.email !== '-') {
        //         mailOptions.subject = "There's new Event!"
        //         mailOptions.to = pegawai.tbl_user.email
        //         mailOptions.html = `Dear , <br/><br/>Hai ada acara baru nih <b>${creator.event_name}.`

        //         let sendEmail = await createTransporter()
        //          sendEmail.sendMail(mailOptions, function (error, info) {
        // transporter.sendMail(mailOptions, function (error, info) {
        //           if (error) {
        //             let error = {
        //               uri: `http://api.polagroup.co.id/events/approvalEvent/${req.params.id}`,
        //               method: 'put',
        //               status: 0,
        //               message: `Send email to ${pegawai.tbl_user.email} is error`,
        //               user_id: req.user.user_id
        //             }
        //             logError(error)
        //           }
        //         })
        //       }
        //     });
        //   });
        // } else if (dataEventInvite[0].option === 'user') {
        //   dataEventInvite.forEach(async element => {
        //     await tbl_users.findByPk(element.user_id)
        //       .then(async ({ dataValues }) => {
        //         mailOptions.subject = "There's new Event!"
        //         mailOptions.to = dataValues.email
        //         mailOptions.html = `Dear , <br/><br/>Hai ada acara baru nih <b>${creator.event_name}.`

        //         let sendEmail = await createTransporter()
        //          sendEmail.sendMail(mailOptions, function (error, info) {
        // transporter.sendMail(mailOptions, function (error, info) {
        //           if (error) {
        //             let error = {
        //               uri: `http://api.polagroup.co.id/events/approvalEvent/${req.params.id}`,
        //               method: 'put',
        //               status: 0,
        //               message: `Send email to ${dataValues.email} is error`,
        //               user_id: req.user.user_id
        //             }
        //             logError(error)
        //           }
        //         })
        //       })
        //   });
        // } else if (dataEventInvite[0].option === 'all') {
        //   let paraPegawai = await tbl_users.findAll()
        //   paraPegawai.forEach(async element => {
        //     if (element.email !== '-') {
        //       mailOptions.subject = "There's new Event!"
        //       mailOptions.to = element.email
        //       mailOptions.html = `Dear , <br/><br/>Hai ada acara baru nih <b>${creator.event_name}.`

        //       let sendEmail = await createTransporter()
        //        sendEmail.sendMail(mailOptions, function (error, info) {
        // transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //           let error = {
        //             uri: `http://api.polagroup.co.id/events/approvalEvent/${req.params.id}`,
        //             method: 'put',
        //             status: 0,
        //             message: `Send email to ${element.email} is error`,
        //             user_id: req.user.user_id
        //           }
        //           logError(error)
        //         }
        //       })
        //     }
        //   });
        // }
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/events/approvalEvent/${req.params.id}`,
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

  static async createMasterCreator(req, res) {
    let newData = {
      user_id: req.body.user_id,
      chief: req.user.user_id
    }

    try {
      let data = await tbl_master_creators.findOne({ where: { chief: req.user.user_id, user_id: req.body.user_id } })

      if (data) {
        let error = {
          uri: `http://api.polagroup.co.id/events/masterCreator`,
          method: 'post',
          status: 400,
          message: `User ${req.body.user_id} sudah menjadi master room`,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(400).json({ message: "Sudah ada" })
      } else {
        tbl_master_creators.create(newData)
          .then(async data => {
            let findNew = await tbl_master_creators.findByPk(data.null)
            res.status(201).json({ message: "Success", data: findNew })
          })

      }
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/events/masterCreator`,
        method: 'post',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err })
      console.log(err)
    }
  }

  static findAllMasterCreator(req, res) {
    tbl_master_creators.findAll({
      where: { chief: req.user.user_id },
      include: [{
        model: tbl_users,
        include: [{
          // as: "tbl_account_detail", 
          model: tbl_account_details,
        }]
      }, {
        model: tbl_users,
        as: 'idChief',
        include: [{
          // as: "tbl_account_detail", 
          model: tbl_account_details,
        }]
      }],
      order: [
        ['master_creator_id', 'DESC']
      ]
    })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/events/masterCreator`,
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

  static deleteMasterCreator(req, res) {
    tbl_master_creators.destroy(
      { where: { master_creator_id: req.params.id } }
    )
      .then(() => {
        res.status(200).json({ info: "Delete Success", id_deleted: req.params.id })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/events/masterCreator/${req.params.id}`,
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

}


async function sendEmail(eventName, option, data, createdBy) {
  if (option === 'company') {
    let user = []
    data.forEach(async element => {
      let paraPegawai = await tbl_department_positions.findAll({
        include: [
          { model: tbl_structure_departments, where: { company_id: element } },
          { model: tbl_users }]
      })

      await paraPegawai.forEach(async pegawai => {
        if (user.indexOf(pegawai.tbl_user.email) === -1) {
          if (pegawai.tbl_user.email !== '-' && pegawai.tbl_user.email) {
            mailOptions.subject = "There's new Event!"
            mailOptions.to = pegawai.tbl_user.email
            mailOptions.html = `Dear , <br/><br/>Hai ada acara baru nih <b>${eventName}.`

            // let sendEmail = await createTransporter()
            // sendEmail.sendMail(mailOptions, function (error, info) {
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                let error = {
                  uri: `http://api.polagroup.co.id/events`,
                  method: 'post',
                  status: 0,
                  message: `Send email to ${pegawai.tbl_user.email} is error`,
                  user_id: createdBy
                }
                logError(error)
              }
            })
          }
          user.push(pegawai.tbl_user.email)
        }
      });
    });
  } else if (option === 'department') {
    let user = []
    data.forEach(async element => {
      let paraPegawai = await tbl_department_positions.findAll({
        include: [
          { model: tbl_structure_departments, where: { departments_id: element } },
          { model: tbl_users }]
      })

      await paraPegawai.forEach(async pegawai => {
        if (user.indexOf(pegawai.tbl_user.email) === -1) {
          if (pegawai.tbl_user.email !== '-' && pegawai.tbl_user.email) {
            mailOptions.subject = "There's new Event!"
            mailOptions.to = pegawai.tbl_user.email
            mailOptions.html = `Dear , <br/><br/>Hai ada acara baru nih <b>${eventName}.`

            // let sendEmail = await createTransporter()
            // sendEmail.sendMail(mailOptions, function (error, info) {
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                let error = {
                  uri: `http://api.polagroup.co.id/events`,
                  method: 'post',
                  status: 0,
                  message: `Send email to ${pegawai.tbl_user.email} is error`,
                  user_id: createdBy
                }
                logError(error)
              }
            })
          }
          user.push(pegawai.tbl_user.email)
        }
      });
    });
  } else if (option === 'user') { //
    data.forEach(async element => {
      await tbl_users.findByPk(element.user_id)
        .then(async ({ dataValues }) => {
          if (dataValues.email !== '-' && dataValues.email) {
            mailOptions.subject = "There's new Event!"
            mailOptions.to = dataValues.email
            mailOptions.html = `Dear , <br/><br/>Hai ada acara baru nih <b>${eventName}.`

            // let sendEmail = await createTransporter()
            // sendEmail.sendMail(mailOptions, function (error, info) {
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                let error = {
                  uri: `http://api.polagroup.co.id/events`,
                  method: 'post',
                  status: 0,
                  message: `Send email to ${dataValues.email} is error`,
                  user_id: createdBy
                }
                logError(error)
              }
            })
          }
        })
    });
  } else if (option === 'all') { //
    let paraPegawai = await tbl_users.findAll()
    paraPegawai.forEach(async element => {
      if (element.email !== '-' && element.email) {
        mailOptions.subject = "There's new Event!"
        mailOptions.to = element.email
        mailOptions.html = `Dear , <br/><br/>Hai ada acara baru nih <b>${eventName}.`

        // let sendEmail = await createTransporter()
        // sendEmail.sendMail(mailOptions, function (error, info) {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            let error = {
              uri: `http://api.polagroup.co.id/events`,
              method: 'post',
              status: 0,
              message: `Send email to ${element.email} is error`,
              user_id: createdBy
            }
            logError(error)
          }
        })
      }
    });
  }
}
module.exports = event
