const { tbl_room_bookings, tbl_rooms, tbl_users, tbl_account_details, tbl_master_rooms, tbl_companys, tbl_buildings, tbl_events, tbl_event_responses, tbl_notifications, tbl_event_invites } = require('../models')
const { mailOptions, transporter } = require('../helpers/nodemailer')
const kue = require('kue')
const queue = kue.createQueue()
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

class bookingRoom {
  // BOOKING ROOM
  static async create(req, res) {
    let dateIn, timeIn, timeOut, room, newData, data_bookingRoomSelected, statusInvalid = false, partisipan = [], created

    partisipan = req.body.partisipan.split(",")
    console.log(req.body.partisipan);

    room = await tbl_rooms.findByPk(req.body.room_id)
    created = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })

    console.log("created.dataValues.fullname", created.dataValues.fullname)

    if (!req.body.room_id || !req.body.date_in || !req.body.time_in || !req.body.time_out || !req.body.subject || !req.body.count) {
      res.status(400).json({ error: 'Data not complite' })
    } else {

      dateIn = req.body.date_in

      //Validation Date in
      if (new Date(dateIn).getDate() > 31 || new Date(dateIn).getDate() < 1 || new Date(dateIn).getMonth() + 1 > 12 || new Date(dateIn).getMonth() + 1 < 1 || new Date(dateIn).getMonth() + 1 < new Date().getMonth() + 1 || new Date(dateIn).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(dateIn).getDate() < Number(new Date().getDate())) {
        res.status(400).json({ error: 'Date in invalid' })
      } else {
        timeIn = req.body.time_in.split(':')
        timeOut = req.body.time_out.split(':')
        console.log("MASUK")
        //Validation time
        data_bookingRoomSelected = await tbl_room_bookings.findAll()

        data_bookingRoomSelected = data_bookingRoomSelected.filter(el => {
          return el.date_in === req.body.date_in
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
            (Number(timeOut[0]) >= Number(everyTimeOut[0]) && Number(everyTimeIn[0]) > Number(timeIn[0]) && Number(req.body.room_id) === Number(el.room_id))
          ) {
            statusInvalid = true
          }
        })

        if (statusInvalid) {
          res.status(400).json({ message: 'Error Time', info: 'Waktu yang pesan sudah terpesan oleh orang lain, harap menentukan waktu yang lain' })
        } else {

          //Validation Time in and Time Out
          if (Number(timeIn[0]) < 8) {
            res.status(400).json({ error: 'Time in must higher than 8' })
          } else if (Number(timeIn[0]) > 17) {
            res.status(400).json({ error: 'Time in must smaller than 17' })
          } else if (Number(timeOut[0]) < 8) {
            res.status(400).json({ error: `Time out must higher than ${Number(timeIn[0])}` })
          } else if (Number(timeOut[0]) > 17) {
            res.status(400).json({ error: 'Limit time out is 17' })
          } else if (Number(timeIn[0]) > Number(timeOut[0])) {
            res.status(400).json({ error: 'Time out must be higher than time in' })
          } else if ((new Date(dateIn).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(dateIn).getDate() < Number(new Date().getDate())) && Number(timeIn[0]) < new Date().getHours()) {
            res.status(400).json({ error: `Time in must higher than ${new Date().getHours()}` })
          } else {

            try {
              tbl_rooms.findByPk(req.body.room_id)
              room = await tbl_rooms.findByPk(Number(req.body.room_id))

              if (room) {
                if (room.max >= req.body.count) {
                  newData = {
                    room_id: req.body.room_id,
                    date_in: req.body.date_in,
                    time_in: req.body.time_in,
                    time_out: req.body.time_out,
                    subject: req.body.subject,
                    user_id: req.user.user_id,
                    count: req.body.count
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
                          keterangan: 'meeting'
                        }
                        let createEvent = await tbl_events.create(newDataEvent)

                        let newDataEventResponse = {
                          event_id: createEvent.null,
                          user_id: req.user.user_id,
                          response: 'creator',
                          creator: 1
                        }

                        await tbl_event_responses.create(newDataEventResponse)

                        partisipan.forEach(async el => {
                          let newDataEventResponse = {
                            event_id: createEvent.null,
                            user_id: el,
                            response: 'waiting'
                          }
                          await tbl_event_responses.create(newDataEventResponse)

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
                                user_id: dataValues.user_id
                              }
                              await tbl_event_invites.create(newData1)

                              mailOptions.to = dataValues.email
                              mailOptions.html = `Dear , <br/><br/>Anda telah diundang oleh <b>${created.dataValues.fullname}</b> untuk mengikuti <b>${req.body.subject}</b> di ruangan <b>${room.dataValues.room}</b>.`
                              queue.create('email').save()
                            })
                        })
                      } catch (err) {
                        res.status(500).json({ err })
                        console.log(err)
                      }
                    })
                    .catch(err => {
                      res.status(500).json({ err })
                      console.log(err);
                    })
                } else {
                  res.status(400).json({ error: 'Total person too much' })
                }
              } else {
                res.status(400).json({ error: 'Bad request!' })
              }
            } catch (err) {
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
      }],
      order: [
        ['room_id', 'ASC'],
        ['date_in', 'ASC'],
        ['time_in', 'ASC'],
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
  ////////////////////////////////////////////////////////
  static findAllMyBookingRooms(req, res) {
    tbl_room_bookings.findAll({
      where: { date_in: { [Op.gte]: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` }, user_id: req.user.user_id },
      include: [{
        model: tbl_users,
        include: [{ model: tbl_account_details }]
      }],
      order: [
        ['room_id', 'ASC'],
        ['date_in', 'ASC'],
        ['time_in', 'ASC'],
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
    tbl_room_bookings.findByPk(req.params.id, {
      include: [{
        model: tbl_users,
        include: [{ model: tbl_account_details }]
      }]
    })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static delete(req, res) {
    tbl_room_bookings.destroy(
      { where: { room_booking_id: req.params.id } }
    )
      .then(() => {
        res.status(200).json({ info: "Delete Success", id_deleted: req.params.id })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static async update(req, res) {
    let dateIn, timeIn, timeOut, roomId, room, newData, data_bookingRoomSelected, statusInvalid = false

    if (!req.body.date_in || !req.body.time_in || !req.body.time_out || !req.body.subject) {
      res.status(400).json({ error: 'Data not complite' })
    } else {
      dateIn = req.body.date_in.split('-')

      if (new Date(dateIn).getDate() > 31 || new Date(dateIn).getDate() < 1 || new Date(dateIn).getMonth() + 1 > 12 || new Date(dateIn).getMonth() + 1 < 1 || new Date(dateIn).getMonth() + 1 < Number(new Date().getMonth() + 1) || new Date(dateIn).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(dateIn).getDate() < Number(new Date().getDate())) {
        res.status(400).json({ error: 'Date in invalid' })
      } else {

        timeIn = req.body.time_in.split(':')
        timeOut = req.body.time_out.split(':')

        //Validation time
        data_bookingRoomSelected = await tbl_room_bookings.findAll()

        data_bookingRoomSelected = data_bookingRoomSelected.filter(el => {
          return el.date_in === req.body.date_in && el.booking_room_id !== req.params.id
        })

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
          res.status(400).json({ message: 'Error Time', info: 'Waktu yang pesan sudah terpesan oleh orang lain, harap menentukan waktu yang lain' })
        } else {
          if (Number(timeIn[0]) < 8) {
            res.status(400).json({ error: 'Time in must higher than 8' })
          } else if (Number(timeIn[0]) > 17) {
            res.status(400).json({ error: 'Time in must smaller than 17' })
          } else if (Number(timeOut[0]) < 8) {
            res.status(400).json({ error: `Time out must higher than ${Number(timeIn[0])}` })
          } else if (Number(timeOut[0]) > 17) {
            res.status(400).json({ error: 'Limit time out is 17' })
          } else if (Number(timeIn[0]) > Number(timeOut[0])) {
            res.status(400).json({ error: 'Time out must be higher than time in' })
          } else if ((new Date(dateIn).getMonth() + 1 == Number(new Date().getMonth() + 1) && new Date(dateIn).getDate() < Number(new Date().getDate())) && Number(timeIn[0]) < new Date().getHours()) {
            res.status(400).json({ error: `Time in must higher than ${new Date().getHours()}` })
          } else {
            try {

              newData = {
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
                  res.status(500).json({ err })
                  console.log(err);
                })
            } catch (err) {
              res.status(500).json(err)
              console.log("err", err)
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
        res.status(500).json({ err })
        console.log(err);
      })
  }
  //=======================================================//

  // ROOM MASTER
  static async createRoomMaster(req, res) {
    console.log("MASUK")
    let newData = {
      user_id: req.body.user_id,
      chief: req.user.user_id
    }

    try {
      let data = await tbl_master_rooms.findOne({ where: { chief: req.user.user_id, user_id: req.body.user_id } })

      if (data) {
        console.log(data)
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
      res.status(500).json({ err })
      console.log(err)
    }
  }

  static findAllRoomMaster(req, res) {
    tbl_master_rooms.findAll({
      where: { chief: req.user.user_id },
      include: [{ model: tbl_users, include: [{ model: tbl_account_details }] }],
      order: [
        ['master_room_id', 'DESC']
      ]
    })
      .then(async data => {
        let dataCompany = await tbl_companys.findAll()
        console.log(req.user.user_id)
        res.status(200).json({ message: "Success", data, dataCompany })
      })
      .catch(err => {
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
        res.status(500).json({ err })
        console.log(err);
      })
  }
  //=======================================================//

  // BUILDING
  static findAllBuilding(req, res) {
    tbl_buildings.findAll({
      order: [
        ['building_id', 'ASC']
      ]
    })
      .then(async data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static createBuilding(req, res) {
    let newData = {
      building: req.body.building,
      company_id: req.body.company_id
    }
    tbl_buildings.create(newData)
      .then(async data => {
        let findNew = await tbl_buildings.findByPk(data.null)
        res.status(201).json({ message: "Success", data: findNew })
      })
      .catch(err => {
        res.status(500).json({ err })
      })
  }

  static deleteBuilding(req, res) {
    tbl_buildings.destroy({ where: { building_id: req.params.id } })
      .then(data => {
        res.status(200).json({ message: 'Success', data })
      })
      .catch(err => {
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
        res.status(500).json({ err })
      })
  }
  //=======================================================//

  // ROOM
  static findAllRoom(req, res) {
    tbl_rooms.findAll({
      include: [{ model: tbl_buildings }], order: [
        ['building_id', 'ASC']
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

  static createRoom(req, res) {
    let newData = {
      room: req.body.room,
      max: req.body.max,
      facilities: req.body.facilities,
      building_id: req.body.building_id
    }

    tbl_rooms.create(newData)
      .then(async data => {
        let findNew = await tbl_rooms.findByPk(data.null)
        res.status(201).json({ message: "Success", data: findNew })
      })
      .catch(err => {
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
        res.status(500).json({ err })
        console.log(err);
      })
  }
  //=======================================================//
}

queue.process('email', function (job, done) {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    } else {
      done()
    }
  })
})

module.exports = bookingRoom

// DOD