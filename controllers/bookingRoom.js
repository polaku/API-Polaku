const { tbl_room_bookings } = require('../models')

class bookingRoom {
  static create(req, res) {
    tbl_room_bookings.create({
      room_id: req.body.room_id,
      date_in: req.body.date_in,
      time_in: req.body.time_in,
      time_out: req.body.time_out,
      subject: req.body.subject,
      created_by: '1',
      count: req.body.count
    })
      .then(({ dataValues }) => {
        res.status(201).json(dataValues)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findAll(req, res) {
    tbl_room_bookings.findAll()
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static findOne(req, res) {
    tbl_room_bookings.findByPk(Number(req.params.id))
      .then(data => {
        res.status(200).json(data)
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
        res.status(200).json({ info: "Delete Success" })
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

  static update(req, res) {
    tbl_room_bookings.update(
      {
        date_in: req.body.date_in,
        time_in: req.body.time_in,
        time_out: req.body.time_out,
        subject: req.body.subject,
        count: req.body.count
      }, {
        where: { room_booking_id: Number(req.params.id) }
      }
    )
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
        console.log(err);
      })
  }

}

module.exports = bookingRoom
