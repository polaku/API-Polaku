const { dbConn } = require('../config')


class announcements {
  static create(req, res) {
    dbConn.query(`INSERT INTO tbl_announcements (title, description, user_id, attachment, start_date, end_date) VALUES ( '${req.body.title}','${req.body.description}', '1', '${req.body.attachment}', '${req.body.startDate}', '${req.body.endDate}')`, function (error, results, fields) {
        if (error) throw res.send(error);
        return res.status(200).json({ data: results });
      });
  }

  static findAll(req, res) {
    dbConn.query(`SELECT * FROM tbl_announcements`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

  static findOne(req, res) {
    dbConn.query(`SELECT * FROM tbl_announcements WHERE announcements_id=${req.params.id}`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

  static delete(req, res) {
    dbConn.query(`DELETE FROM tbl_announcements WHERE announcements_id=${req.params.id}`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

  static update(req, res) {
    dbConn.query(`UPDATE tbl_announcements SET title='${req.body.title}', description='${req.body.description}', attachment='${req.body.attachment}', start_date='${req.body.startDate}', end_date='${req.body.endDate}' WHERE announcements_id=${req.params.id}`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

}

module.exports = announcements