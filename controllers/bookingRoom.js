const { dbConn } = require('../config')

class bookingRoom {
  static create(req, res) {
    dbConn.query(`INSERT INTO tbl_room_booking (room_id, date_in, time_in, time_out, subject, created_by, count) VALUES ( '${req.body.room_id}','${req.body.date_in}','${req.body.time_in}','${req.body.time_out}', '${req.body.subject}', '1', '${req.body.count}')`, function (error, results, fields) {
        if (error) throw res.send(error);
        return res.status(200).json({ data: results });
      });
  }

  static findAll(req, res) {
    dbConn.query(`SELECT * FROM tbl_room_booking`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

  static findOne(req, res) {
    dbConn.query(`SELECT * FROM tbl_room_booking WHERE room_booking_id=${req.params.id}`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

  static delete(req, res) {
    dbConn.query(`DELETE FROM tbl_room_booking WHERE room_booking_id=${req.params.id}`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

  static update(req, res) {
    dbConn.query(`UPDATE tbl_room_booking SET date_in='${req.body.date_in}', time_in='${req.body.time_in}', time_out='${req.body.time_out}', subject='${req.body.subject}', count='${req.body.count}' WHERE room_booking_id=${req.params.id}`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

}

module.exports = bookingRoom
