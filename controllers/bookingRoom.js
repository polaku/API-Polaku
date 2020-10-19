const { tbl_room_bookings, tbl_rooms, tbl_users, tbl_account_details, tbl_master_rooms, tbl_companys, tbl_buildings, tbl_events, tbl_event_responses, tbl_notifications, tbl_event_invites, tbl_departments } = require('../models')
const { mailOptions, transporter } = require('../helpers/nodemailer')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const logError = require('../helpers/logError')

class bookingRoom {
  // BOOKING ROOM
  static async create(req, res) {
    let dateIn, timeIn, timeOut, room, newData, data_bookingRoomSelected, statusInvalid = false, partisipan = [], created, countPartisipan = 0

    if (req.body.partisipan) partisipan = JSON.parse(req.body.partisipan)
    if (req.body.count) countPartisipan = req.body.count

    room = await tbl_rooms.findByPk(req.body.room_id)
    created = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })

    if (!req.body.room_id || !req.body.date_in || !req.body.time_in || !req.body.time_out || !req.body.subject) {
      let error = {
        uri: `http://api.polagroup.co.id/bookingRoom`,
        method: 'post',
        status: 400,
        message: 'Data not complite',
        user_id: req.user.user_id
      }
      logError(error)
      res.status(400).json({ error: 'Data not complite' })
    } else {

      dateIn = req.body.date_in

      //Validation Date in
      if (new Date(dateIn).getDate() > 31 || new Date(dateIn).getDate() < 1 || new Date(dateIn).getMonth() + 1 > 12 || new Date(dateIn).getMonth() + 1 < 1 || new Date(dateIn).getMonth() + 1 < new Date().getMonth() + 1 || new Date(dateIn).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(dateIn).getDate() < Number(new Date().getDate())) {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom`,
          method: 'post',
          status: 400,
          message: 'Date in invalid',
          user_id: req.user.user_id
        }
        logError(error)
        res.status(400).json({ error: 'Date in invalid' })
      } else {
        timeIn = req.body.time_in.split(':')
        timeOut = req.body.time_out.split(':')

        //Validation time
        data_bookingRoomSelected = await tbl_room_bookings.findAll()

        data_bookingRoomSelected = data_bookingRoomSelected.filter(el => {
          return el.date_in === req.body.date_in.slice(0, 10)
        })

        data_bookingRoomSelected.forEach(el => {
          let everyTimeIn, everyTimeOut
          everyTimeIn = el.time_in.split(':')
          everyTimeOut = el.time_out.split(':')

          if (
            (Number(everyTimeIn[0]) < Number(timeIn[0]) && Number(timeIn[0]) < Number(everyTimeOut[0]) && Number(req.body.room_id) === Number(el.room_id)) ||
            (Number(everyTimeIn[0]) < Number(timeOut[0]) && Number(timeOut[0]) < Number(everyTimeOut[0]) && Number(req.body.room_id) === Number(el.room_id)) ||
            (Number(everyTimeIn[0]) === Number(timeIn[0]) && Number(req.body.room_id) === Number(el.room_id)) ||
            (Number(timeOut[0]) === Number(everyTimeOut[0]) && Number(req.body.room_id) === Number(el.room_id)) ||
            (Number(timeOut[0]) >= Number(everyTimeOut[0]) && Number(everyTimeIn[0]) > Number(timeIn[0]) && Number(req.body.room_id) === Number(el.room_id)) ||
            (Number(timeOut[0]) === Number(everyTimeIn[0]) && (Number(timeOut[1]) > Number(everyTimeIn[1]) && Number(req.body.room_id) === Number(el.room_id))) ||
            (Number(timeIn[0]) === Number(everyTimeOut[0]) && (Number(timeIn[1]) < Number(everyTimeOut[1]) && Number(req.body.room_id) === Number(el.room_id)))
          ) {
            statusInvalid = true
          }
        })

        if (statusInvalid) {
          let error = {
            uri: `http://api.polagroup.co.id/bookingRoom`,
            method: 'post',
            status: 400,
            message: 'Time has booked',
            user_id: req.user.user_id
          }
          logError(error)
          res.status(400).json({ message: 'Error Time', info: 'Waktu yang pesan sudah terpesan oleh orang lain, harap menentukan waktu yang lain' })
        } else {

          //Validation Time in and Time Out
          if (Number(timeIn[0]) < new Date(room.open_gate).getHours()) {
            let error = {
              uri: `http://api.polagroup.co.id/bookingRoom`,
              method: 'post',
              status: 400,
              message: `Time in must higher than ${new Date(room.open_gate).getHours()}`,
              user_id: req.user.user_id
            }
            logError(error)
            res.status(400).json({ error: `Time in must higher than ${new Date(room.open_gate).getHours()}` })
          } else if (Number(timeIn[0]) > 19) {
            let error = {
              uri: `http://api.polagroup.co.id/bookingRoom`,
              method: 'post',
              status: 400,
              message: `Time in must smaller than 19`,
              user_id: req.user.user_id
            }
            logError(error)
            res.status(400).json({ error: `Time in must smaller than 19` })
          } else if (Number(timeOut[0]) < new Date(room.open_gate).getHours()) {
            let error = {
              uri: `http://api.polagroup.co.id/bookingRoom`,
              method: 'post',
              status: 400,
              message: `Time out must higher than ${new Date(room.open_gate).getHours()}`,
              user_id: req.user.user_id
            }
            logError(error)
            res.status(400).json({ error: `Time out must higher than ${new Date(room.open_gate).getHours()}` })
          } else if (Number(timeOut[0]) > 19) {
            let error = {
              uri: `http://api.polagroup.co.id/bookingRoom`,
              method: 'post',
              status: 400,
              message: `Limit time out is 19`,
              user_id: req.user.user_id
            }
            logError(error)
            res.status(400).json({ error: `Limit time out is 19` })
          } else if (Number(timeIn[0]) > Number(timeOut[0])) {
            let error = {
              uri: `http://api.polagroup.co.id/bookingRoom`,
              method: 'post',
              status: 400,
              message: `Time out must be higher than time in`,
              user_id: req.user.user_id
            }
            logError(error)
            res.status(400).json({ error: 'Time out must be higher than time in' })
          } else if ((new Date(dateIn).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(dateIn).getDate() < Number(new Date().getDate())) && Number(timeIn[0]) < new Date().getHours()) {
            let error = {
              uri: `http://api.polagroup.co.id/bookingRoom`,
              method: 'post',
              status: 400,
              message: `Time in must higher than ${new Date().getHours()}`,
              user_id: req.user.user_id
            }
            logError(error)
            res.status(400).json({ error: `Time in must higher than ${new Date().getHours()}` })
          } else {

            try {
              tbl_rooms.findByPk(req.body.room_id)
              room = await tbl_rooms.findByPk(Number(req.body.room_id))

              if (room) {
                if (room.max >= countPartisipan) {
                  newData = {
                    room_id: req.body.room_id,
                    date_in: req.body.date_in,
                    time_in: req.body.time_in,
                    time_out: req.body.time_out,
                    subject: req.body.subject,
                    user_id: req.user.user_id,
                    count: partisipan.length > countPartisipan ? partisipan.length : countPartisipan
                  }

                  tbl_room_bookings.create(newData)
                    .then(async data => {
                      let findNew = await tbl_room_bookings.findByPk(data.null)
                      res.status(201).json({ message: "Success", data: findNew })

                      let room = await tbl_rooms.findByPk(req.body.room_id, { include: [{ model: tbl_buildings }] })

                      try {
                        let newDataEvent = {
                          event_name: req.body.subject,
                          description: req.body.subject,
                          start_date: req.body.date_in,
                          end_date: req.body.date_in,
                          location: `${room.room},${room.tbl_building.building}`,
                          user_id: req.user.user_id,
                          keterangan: 'meeting',
                          room_booking_id: findNew.room_booking_id,
                          time_in: req.body.time_in,
                          time_out: req.body.time_out,
                          status: 1
                        }
                        let createEvent = await tbl_events.create(newDataEvent)
                        let newDataEventResponse = {
                          event_id: createEvent.null,
                          user_id: req.user.user_id,
                          response: 'creator',
                          creator: 1
                        }

                        let creatorBookingRoom = await tbl_event_responses.create(newDataEventResponse)

                        if (partisipan.length != 0) {
                          partisipan.forEach(async el => {
                            if (Number(el) === Number(req.user.user_id)) {
                              tbl_event_responses.update({ response: 'waiting' }, { where: { event_response_id: creatorBookingRoom.null, user_id: el } })
                                .then(() => { })
                                .catch(err => {
                                  let error = {
                                    uri: `http://api.polagroup.co.id/bookingRoom`,
                                    method: 'post',
                                    status: 500,
                                    message: err,
                                    user_id: req.user.user_id
                                  }
                                  logError(error)
                                })
                            } else {
                              let newDataEventResponse = {
                                event_id: createEvent.null,
                                user_id: el,
                                response: 'waiting'
                              }
                              await tbl_event_responses.create(newDataEventResponse)
                            }
                            tbl_users.findByPk(el)
                              .then(async ({ dataValues }) => {
                                let newDes = req.body.subject.split(" ")
                                if (newDes.length > 3) {
                                  newDes = newDes.slice(0, 3).join(" ") + '...'
                                } else {
                                  newDes = newDes.join(" ")
                                }
                                let newData = {
                                  description: newDes,
                                  from_user_id: req.user.user_id,
                                  to_user_id: dataValues.user_id,
                                  value: "Meeting",
                                  link: `/event/detailEvent/${createEvent.null}`,
                                }
                                await tbl_notifications.create(newData)

                                let newData1 = {
                                  event_id: createEvent.null,
                                  option: 'user',
                                  user_id: el,
                                }
                                await tbl_event_invites.create(newData1)

                                mailOptions.subject = "You have invited!"
                                mailOptions.to = dataValues.email
                                mailOptions.html = `Dear , <br/><br/>Anda telah diundang oleh <b>${created.dataValues.fullname}</b> untuk mengikuti <b>${req.body.subject}</b> di ruangan <b>${room.dataValues.room}</b>.`
                                transporter.sendMail(mailOptions, function (error, info) {
                                  if (error) {
                                    let error = {
                                      uri: `http://api.polagroup.co.id/bookingRoom`,
                                      method: 'post',
                                      status: 0,
                                      message: `Send email to ${dataValues.email} is error`,
                                      user_id: req.user.user_id
                                    }
                                    logError(error)
                                  }
                                })
                              })
                          })
                        } 20
                      } catch (err) {
                        let error = {
                          uri: `http://api.polagroup.co.id/bookingRoom`,
                          method: 'post',
                          status: 500,
                          message: err,
                          user_id: req.user.user_id
                        }
                        logError(error)
                        res.status(500).json({ err })
                        console.log(err)
                      }
                    })
                    .catch(err => {
                      let error = {
                        uri: `http://api.polagroup.co.id/bookingRoom`,
                        method: 'post',
                        status: 500,
                        message: err,
                        user_id: req.user.user_id
                      }
                      logError(error)
                      // res.status(500).json({ err })
                      console.log(err);
                    })
                } else {
                  let error = {
                    uri: `http://api.polagroup.co.id/bookingRoom`,
                    method: 'post',
                    status: 400,
                    message: 'Total person too much',
                    user_id: req.user.user_id
                  }
                  logError(error)
                  res.status(400).json({ error: 'Total person too much' })
                }
              } else {
                let error = {
                  uri: `http://api.polagroup.co.id/bookingRoom`,
                  method: 'post',
                  status: 400,
                  message: 'Bad request!',
                  user_id: req.user.user_id
                }
                logError(error)
                res.status(400).json({ error: 'Bad request!' })
              }
            } catch (err) {
              let error = {
                uri: `http://api.polagroup.co.id/bookingRoom`,
                method: 'post',
                status: 500,
                message: err,
                user_id: req.user.user_id
              }
              logError(error)
              res.status(500).json(err)
            }
          }
        }

      }
    }
  }

  static findAllBookingRooms(req, res) {
    tbl_room_bookings.findAll({
      where: { date_in: { [Op.gte]: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` } },
      include: [{
        model: tbl_users,
        include: [{ model: tbl_account_details }]
      },
      {
        model: tbl_rooms
      }],
      order: [
        ['room_id', 'ASC'],
        ['date_in', 'ASC'],
        ['time_in', 'ASC'],
      ],
    })
      .then(async (data) => {
        let event = {}, eventResponses = [], counter = 0

        if (data.length !== 0) {
          data.forEach(async el => {
            event = await tbl_events.findOne({ where: { room_booking_id: el.room_booking_id } })
            if (event) {
              let eventRespon = await tbl_event_responses.findAll({
                where: { event_id: event.event_id },
                include: [
                  {
                    model: tbl_users,
                    include: [{ model: tbl_account_details }]
                  }]
              })
              eventResponses.push(eventRespon)
            }
            counter++
            if (counter === data.length) res.status(200).json({ message: "Success", data, eventResponses })

          })
        } else {
          res.status(200).json({ message: "Success", data, eventResponses })
        }
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom`,
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

  static findAllMyBookingRooms(req, res) {
    tbl_room_bookings.findAll({
      where: { date_in: { [Op.gte]: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` }, user_id: req.user.user_id },
      include: [{
        model: tbl_users,
        include: [{ model: tbl_account_details }]
      },
      {
        model: tbl_rooms
      }],
      order: [
        ['room_id', 'ASC'],
        ['date_in', 'DESC'],
        ['time_in', 'ASC'],
      ],
    })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/myRoom`,
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
    tbl_room_bookings.findByPk(req.params.id, {
      include: [{
        model: tbl_users,
        include: [{ model: tbl_account_details }]
      },
      {
        model: tbl_rooms,
      }]
    })
      .then(async (data) => {
        let event = {}, eventResponses = []

        event = await tbl_events.findOne({ where: { room_booking_id: req.params.id } })
        if (event) {
          eventResponses = await tbl_event_responses.findAll({
            where: { event_id: event.event_id },
            include: [
              {
                model: tbl_users,
                include: [{ model: tbl_account_details }]
              }]
          })
        }

        res.status(200).json({ message: "Success", data, eventResponses })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
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
    let dataWillDelete = await tbl_room_bookings.findByPk(req.params.id)

    tbl_room_bookings.destroy(
      { where: { room_booking_id: req.params.id } }
    )
      .then(async () => {

        if (dataWillDelete.user_id !== req.user.user_id) {
          let accountCreator = await tbl_account_details.findOne({ where: { user_id: dataWillDelete.user_id } })
          let accountAdmin = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })

          mailOptions.subject = "Your meeting room had cancelled"
          mailOptions.to = accountCreator.email
          mailOptions.html = `Dear , <br/><br/>Ruangan anda yang dibooking pada tanggal 
          ${new Date(dataWillDelete.date_in).getDate()}-${new Date(dataWillDelete.date_in).getMonth() + 1}-${new Date(dataWillDelete.date_in).getFullYear()} di ruang ${dataWillDelete.tbl_room.room}, telah di batalkan oleh <b>${accountAdmin.fullname}</b>.<br/><br/>Terima Kasih.`
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              let error = {
                uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
                method: 'delete',
                status: 0,
                message: `Send email to ${accountCreator.email} is error`,
                user_id: req.user.user_id
              }
              logError(error)
            }
          })
        }

        let theEvent = await tbl_events.findOne({ where: { room_booking_id: req.params.id } })

        await tbl_events.destroy({ where: { event_id: theEvent.event_id } })
        await tbl_event_invites.destroy({ where: { event_id: theEvent.event_id } })
        await tbl_event_responses.destroy({ where: { event_id: theEvent.event_id } })

        res.status(200).json({ info: "Delete Success", id_deleted: req.params.id })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
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

  static async update(req, res) {
    let dateIn, timeIn, timeOut, room_booking, room, newData, data_bookingRoomSelected, statusInvalid = false

    if (!req.body.date_in || !req.body.time_in || !req.body.time_out || !req.body.subject) {
      let error = {
        uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
        method: 'put',
        status: 500,
        message: 'Data not complite',
        user_id: req.user.user_id
      }
      logError(error)
      res.status(400).json({ error: 'Data not complite' })
    } else {
      dateIn = req.body.date_in.split('-')

      if (new Date(dateIn).getDate() > 31 || new Date(dateIn).getDate() < 1 || new Date(dateIn).getMonth() + 1 > 12 || new Date(dateIn).getMonth() + 1 < 1 || new Date(dateIn).getMonth() + 1 < Number(new Date().getMonth() + 1) || new Date(dateIn).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(dateIn).getDate() < Number(new Date().getDate())) {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
          method: 'put',
          status: 500,
          message: 'Date in invalid',
          user_id: req.user.user_id
        }
        logError(error)
        res.status(400).json({ error: 'Date in invalid' })
      } else {

        timeIn = req.body.time_in.split(':')
        timeOut = req.body.time_out.split(':')

        //Validation time
        room_booking = await tbl_room_bookings.findByPk(req.params.id)
        room = await tbl_rooms.findByPk(room_booking.room_id)
        data_bookingRoomSelected = await tbl_room_bookings.findAll()

        data_bookingRoomSelected = await data_bookingRoomSelected.filter(el =>
          el.date_in === req.body.date_in.slice(0, 10) &&
          Number(el.room_booking_id) !== Number(req.params.id) &&
          Number(el.room_id) === Number(req.body.room_id)
        )

        data_bookingRoomSelected.forEach(el => {
          let everyTimeIn, everyTimeOut
          everyTimeIn = el.time_in.split(':')
          everyTimeOut = el.time_out.split(':')

          if (
            (Number(everyTimeIn[0]) < Number(timeIn[0]) && Number(timeIn[0]) < Number(everyTimeOut[0])) ||
            (Number(everyTimeIn[0]) < Number(timeOut[0]) && Number(timeOut[0]) < Number(everyTimeOut[0])) ||
            Number(everyTimeIn[0]) === Number(timeIn[0]) ||
            Number(timeOut[0]) === Number(everyTimeOut[0])
          ) {
            statusInvalid = true
          }
        })

        if (statusInvalid) {
          let error = {
            uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
            method: 'put',
            status: 400,
            message: 'Time has booked',
            user_id: req.user.user_id
          }
          logError(error)
          res.status(400).json({ message: 'Error Time', info: 'Waktu yang pesan sudah terpesan oleh orang lain, harap menentukan waktu yang lain' })
        } else {
          if (Number(timeIn[0]) < new Date(room.open_gate).getHours()) {
            let error = {
              uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
              method: 'put',
              status: 400,
              message: `Time in must higher than ${new Date(room.open_gate).getHours()}`,
              user_id: req.user.user_id
            }
            logError(error)
            res.status(400).json({ error: `Time in must higher than ${new Date(room.open_gate).getHours()}` })
          } else if (Number(timeIn[0]) > 19) {
            let error = {
              uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
              method: 'put',
              status: 400,
              message: `Time in must smaller than 19`,
              user_id: req.user.user_id
            }
            logError(error)
            res.status(400).json({ error: `Time in must smaller than 19` })
          } else if (Number(timeOut[0]) < new Date(room.open_gate).getHours()) {
            let error = {
              uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
              method: 'put',
              status: 400,
              message: `Time out must higher than ${new Date(room.open_gate).getHours()}`,
              user_id: req.user.user_id
            }
            logError(error)
            res.status(400).json({ error: `Time out must higher than ${new Date(room.open_gate).getHours()}` })
          } else if (Number(timeOut[0]) > 19) {
            let error = {
              uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
              method: 'put',
              status: 400,
              message: `Limit time out is 19`,
              user_id: req.user.user_id
            }
            logError(error)
            res.status(400).json({ error: `Limit time out is 19` })
          } else if (Number(timeIn[0]) > Number(timeOut[0])) {
            let error = {
              uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
              method: 'put',
              status: 400,
              message: `Time out must be higher than time in`,
              user_id: req.user.user_id
            }
            logError(error)
            res.status(400).json({ error: 'Time out must be higher than time in' })
          } else if ((new Date(dateIn).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(dateIn).getDate() < Number(new Date().getDate())) && Number(timeIn[0]) < new Date().getHours()) {
            let error = {
              uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
              method: 'put',
              status: 400,
              message: `Time in must higher than ${new Date().getHours()}`,
              user_id: req.user.user_id
            }
            logError(error)
            res.status(400).json({ error: `Time in must higher than ${new Date().getHours()}` })
          } else {
            try {
              newData = {
                room_id: req.body.room_id,
                date_in: req.body.date_in,
                time_in: req.body.time_in,
                time_out: req.body.time_out,
                subject: req.body.subject,
                count: req.body.count
              }

              tbl_room_bookings.update(newData, {
                where: { room_booking_id: req.params.id }
              })
                .then(async () => {
                  let dataReturning = await tbl_room_bookings.findByPk(req.params.id)

                  res.status(200).json({ message: "Success", data: dataReturning })
                })
                .catch(err => {
                  let error = {
                    uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
                    method: 'put',
                    status: 500,
                    message: err,
                    user_id: req.user.user_id
                  }
                  logError(error)
                  res.status(500).json({ err })
                  console.log(err);
                })
            } catch (err) {
              let error = {
                uri: `http://api.polagroup.co.id/bookingRoom/${req.params.id}`,
                method: 'put',
                status: 500,
                message: err,
                user_id: req.user.user_id
              }
              logError(error)
              res.status(500).json(err)
              console.log(err)
            }
          }
        }
      }
    }
  }

  static findAllRoomsInMonth(req, res) {
    tbl_room_bookings.findAll({
      where: { room_id: req.params.idRoom },
      include: [{
        model: tbl_users,
        include: [{ model: tbl_account_details }]
      }],
      order: [
        ['date_in', 'ASC'],
        ['time_in', 'ASC']
      ],
    })
      .then(data => {
        let temp = []
        data.forEach(element => {
          let date_in = element.date_in.split('-')
          if (Number(date_in[1]) === Number(req.params.month)) {
            temp.push(element)
          }
        });
        res.status(200).json({ message: "Success", data: temp })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/${req.params.idRoom}/${req.params.month}`,
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

  static findAllMyRoomsInMonth(req, res) {
    tbl_room_bookings.findAll({
      where: { room_id: req.params.idRoom, user_id: req.user.user_id },
      include: [{
        model: tbl_users,
        include: [{ model: tbl_account_details }]
      }]
    })
      .then(data => {
        let temp = []
        data.forEach(element => {
          let date_in = element.date_in.split('-')
          if (Number(date_in[1]) === Number(req.params.month)) {
            temp.push(element)
          }
        });
        res.status(200).json({ message: "Success", data: temp })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/${req.params.idRoom}/${req.params.month}/myRoom`,
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
  //=======================================================//

  // ROOM MASTER
  static async createRoomMaster(req, res) {
    let newData = {
      user_id: req.body.user_id,
      chief: req.user.user_id
    }

    try {
      let data = await tbl_master_rooms.findOne({ where: { chief: req.user.user_id, user_id: req.body.user_id } })

      if (data) {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/roomMaster`,
          method: 'post',
          status: 400,
          message: "Sudah ada menjadi master room",
          user_id: req.user.user_id
        }
        logError(error)
        res.status(400).json({ message: "Sudah ada" })
      } else {

        if (req.body.room_id) { newData.room_id = req.body.room_id }
        if (req.body.company_id) { newData.company_id = req.body.company_id }

        tbl_master_rooms.create(newData)
          .then(async data => {
            let findNew = await tbl_master_rooms.findByPk(data.null)
            res.status(201).json({ message: "Success", data: findNew })
          })

      }
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/bookingRoom/roomMaster`,
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

  static findAllRoomMaster(req, res) {
    tbl_master_rooms.findAll({
      where: { chief: req.user.user_id },
      include: [{
        model: tbl_users,
        include: [{ model: tbl_account_details }]
      }],
      order: [
        ['master_room_id', 'DESC']
      ]
    })
      .then(async data => {
        let dataCompany = await tbl_companys.findAll()
        res.status(200).json({ message: "Success", data, dataCompany })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/roomMaster`,
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

  static deleteRoomMaster(req, res) {
    tbl_master_rooms.destroy(
      { where: { master_room_id: req.params.id } }
    )
      .then(() => {
        res.status(200).json({ message: "Delete Success", id_deleted: req.params.id })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/roomMaster/${req.params.id}`,
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

  static editRoomMaster(req, res) {
    let newData = {}
    if (req.body.company_id) newData = { company_id: req.body.company_id }
    if (req.body.room_id) newData = { room_id: req.body.room_id }

    tbl_master_rooms.update(newData, {
      where: { master_room_id: req.params.id }
    })
      .then(async () => {
        let data = await tbl_master_rooms.findByPk(req.params.id)

        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/roomMaster/${req.params.id}`,
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
  //=======================================================//

  // BUILDING
  static async findAllBuilding(req, res) {
    let userAccountDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
    let dinamicCondition = {}

    if (userAccountDetail.company_id === 2) {                   // Khusus Artistika
      dinamicCondition = { building_id: 1 }
    } else {            // KECUALI ARTISTIKA
      dinamicCondition = {
        [Op.or]: [
          { building_id: userAccountDetail.building_id },
          { location_id: userAccountDetail.location_id },
          { company_id: userAccountDetail.company_id }
        ]
      }
    }
    // else if (userAccountDetail.company_id === 5) {            // Khusus BPW
    //   if (userAccountDetail.building_id) {
    //     dinamicCondition = {
    //       [Op.or]: [
    //         { building_id: 1 },
    //         { building_id: userAccountDetail.building_id }
    //       ]
    //     }
    //   } else if (userAccountDetail.location_id) {
    //     dinamicCondition = {
    //       [Op.or]: [
    //         { building_id: 1 },
    //         { location_id: userAccountDetail.location_id }
    //       ]
    //     }
    //   } else {
    //     dinamicCondition = {
    //       [Op.or]: [
    //         { building_id: 1 },
    //         { company_id: userAccountDetail.company_id }
    //       ]
    //     }
    //   }
    // }
    // else if (userAccountDetail.building_id) {                 // Bila ada building_id di tbl_account_details
    //   dinamicCondition = { building_id: userAccountDetail.building_id }
    // } else if (userAccountDetail.location_id) {                 // Bila ada location_id di tbl_account_details
    //   dinamicCondition = { location_id: userAccountDetail.location_id }
    // } else {                                                    // Berdasarkan company //
    //   dinamicCondition = { company_id: userAccountDetail.company_id }
    // }

    tbl_buildings.findAll({
      where: dinamicCondition,
      order: [
        ['building_id', 'ASC']
      ]
    })
      .then(async data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/building`,
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

  static createBuilding(req, res) {
    let newData = {
      building: req.body.building,
      company_id: req.body.company_id,
      location_id: req.body.location_id || 0
    }
    tbl_buildings.create(newData)
      .then(async data => {
        let findNew = await tbl_buildings.findByPk(data.null)
        res.status(201).json({ message: "Success", data: findNew })
      })
      .catch(err => {
        console.log(err)
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/building`,
          method: 'post',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
      })
  }

  static deleteBuilding(req, res) {
    tbl_buildings.destroy({ where: { building_id: req.params.id } })
      .then(data => {
        res.status(200).json({ message: 'Success', data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/building/${req.params.id}`,
          method: 'delete',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
      })
  }

  static editBuilding(req, res) {
    let newData = {
      building: req.body.building,
      company_id: req.body.company_id
    }
    tbl_buildings.update(newData, { where: { building_id: req.params.id } })
      .then(data => {
        res.status(200).json({ message: 'Success', data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/building/${req.params.id}`,
          method: 'put',
          status: 500,
          message: err,
          user_id: req.user.user_id
        }
        logError(error)
        res.status(500).json({ err })
      })
  }
  //=======================================================//

  // ROOM
  static async findAllRoom(req, res) {
    let userAccountDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
    let dinamicCondition = {}

    if (userAccountDetail.company_id === 2) {                   // Khusus Artistika
      dinamicCondition = { building_id: 1 }
      // dinamicCondition = { building_id: 1, company_id: 2 }
    } else {      //KECUALI ARTISTIKA
      dinamicCondition = {
        [Op.or]: [
          { building_id: userAccountDetail.building_id, room_id: { [Op.ne]: 12 } },
          { location_id: userAccountDetail.location_id, room_id: { [Op.ne]: 12 } },
          { company_id: userAccountDetail.company_id, room_id: { [Op.ne]: 12 } }
        ]
      }
    }
    // else if (userAccountDetail.company_id === 5) {            // Khusus BPW
    //   if (userAccountDetail.building_id) {
    //     dinamicCondition = {
    //       [Op.or]: [
    //         { building_id: 1, room_id: { [Op.ne]: 12 } },
    //         { building_id: userAccountDetail.building_id, room_id: { [Op.ne]: 12 } }
    //       ]
    //     }
    //   } else if (userAccountDetail.location_id) {
    //     dinamicCondition = {
    //       [Op.or]: [
    //         { building_id: 1, room_id: { [Op.ne]: 12 } },
    //         { location_id: userAccountDetail.location_id, room_id: { [Op.ne]: 12 } }
    //       ]
    //     }
    //   } else {
    //     dinamicCondition = {
    //       [Op.or]: [
    //         { building_id: 1, room_id: { [Op.ne]: 12 } },
    //         { company_id: userAccountDetail.company_id, room_id: { [Op.ne]: 12 } }
    //       ]
    //     }
    //   }
    // } else if (userAccountDetail.building_id) {                 // Bila ada building_id di tbl_account_details
    //   dinamicCondition = { building_id: userAccountDetail.building_id, room_id: { [Op.ne]: 12 } }
    // } else if (userAccountDetail.location_id) {                  // Bila ada location_id di tbl_account_details
    //   dinamicCondition = { location_id: userAccountDetail.location_id, room_id: { [Op.ne]: 12 } }
    // } else {                                                    // Berdasarkan company
    //   dinamicCondition = { company_id: userAccountDetail.company_id, room_id: { [Op.ne]: 12 } }
    // }

    tbl_rooms.findAll({
      where: dinamicCondition,
      include: [{ model: tbl_buildings }],
      order: [
        ['building_id', 'ASC']
      ],
    })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/rooms`,
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

  static async createRoom(req, res) {

    let building = await tbl_buildings.findByPk(req.body.building_id)

    let newData = {
      room: req.body.room,
      max: req.body.max,
      facilities: req.body.facilities,
      company_id: building.company_id,
      building_id: req.body.building_id,
      location_id: building.location_id,
    }

    tbl_rooms.create(newData)
      .then(async data => {
        let findNew = await tbl_rooms.findByPk(data.null)
        res.status(201).json({ message: "Success", data: findNew })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/rooms`,
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

  static deleteRoom(req, res) {
    tbl_rooms.destroy(
      { where: { room_id: req.params.id } }
    )
      .then(() => {
        res.status(200).json({ message: "Delete Success", id_deleted: req.params.id })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/rooms/${req.params.id}`,
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

  static editRoom(req, res) {
    let newData = {
      room: req.body.room,
      max: req.body.max,
      facilities: req.body.facilities,
    }

    tbl_rooms.update(newData,
      { where: { room_id: req.params.id } }
    )
      .then(async () => {
        let data = await tbl_rooms.findByPk(req.params.id)
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/bookingRoom/rooms/${req.params.id}`,
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
  //=======================================================//
}


module.exports = bookingRoom

// DOD