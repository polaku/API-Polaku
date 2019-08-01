const { tbl_room_bookings, tbl_rooms } = require('../models')

class bookingRoom {
  static async create(req, res) {
    let dateIn, timeIn, timeOut, room, newData

    if (!req.body.room_id || !req.body.date_in || !req.body.time_in || !req.body.time_out || !req.body.subject || !req.body.count) {
      res.status(400).json({ error: 'Data not complite' })
    } else {

      dateIn = req.body.date_in.split('-')

      //Validation Date in
      if (Number(dateIn[2]) > 31 || Number(dateIn[2]) < 1 || Number(dateIn[1]) > 12 || Number(dateIn[1]) < 1 || Number(dateIn[1]) < Number(new Date().getMonth() + 1) || Number(dateIn[1]) == Number(new Date().getMonth() + 1) && Number(dateIn[2]) < Number(new Date().getDate())) {
        res.status(400).json({ error: 'Date in invalid' })
      } else {
        timeIn = req.body.time_in.split(':')
        timeOut = req.body.time_out.split(':')

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
        } else if ((Number(dateIn[1]) == Number(new Date().getMonth() + 1) && Number(dateIn[2]) < Number(new Date().getDate())) && Number(timeIn[0]) < new Date().getHours()) {
          res.status(400).json({ error: `Time in must higher than ${new Date().getHours()}` })
        } else {

          try {
            room = await tbl_rooms.findByPk(Number(req.body.room_id))
            console.log(room);

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
                  .then(data => {
                    res.status(201).json({ message: "Success", data })
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

  static findAll(req, res) {
    tbl_room_bookings.findAll({ include: [{ model: tbl_users }] })
      .then(data => {
        res.status(200).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_room_bookings.findByPk(req.params.id, { include: [{ model: tbl_users }] })
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
    let dateIn, timeIn, timeOut, roomId, room, newData

    if (!req.body.room_id || !req.body.date_in || !req.body.time_in || !req.body.time_out || !req.body.subject || !req.body.count) {
      res.status(400).json({ error: 'Data not complite' })
    } else {
      dateIn = req.body.date_in.split('-')

      if (Number(dateIn[2]) > 31 || Number(dateIn[2]) < 1 || Number(dateIn[1]) > 12 || Number(dateIn[1]) < 1 || Number(dateIn[1]) < Number(new Date().getMonth() + 1) || Number(dateIn[1]) == Number(new Date().getMonth() + 1) && Number(dateIn[2]) < Number(new Date().getDate())) {
        res.status(400).json({ error: 'Date in invalid' })
      } else {
        timeIn = req.body.time_in.split(':')
        timeOut = req.body.time_out.split(':')

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
        } else if ((Number(dateIn[1]) == Number(new Date().getMonth() + 1) && Number(dateIn[2]) < Number(new Date().getDate())) && Number(timeIn[0]) < new Date().getHours()) {
          res.status(400).json({ error: `Time in must higher than ${new Date().getHours()}` })
        } else {

          try {

            roomId = await tbl_room_bookings.findByPk(req.params.id, { include: [{ model: tbl_users }] })
            room = await tbl_rooms.findByPk(roomId.room_id)
            console.log(room);

            if (room) {
              if (room.max >= req.body.count) {
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

module.exports = bookingRoom
