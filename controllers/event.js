const { dbConn } = require('../config')

class news {
  static create(req, res) {
    dbConn.query(`INSERT INTO tbl_event (event_name, description, start_date, end_date, location, thumbnail, user_id ) VALUES ( '${req.body.event_name}', '${req.body.description}', '${req.body.start_date}', '${req.body.end_date}', '${req.body.location}', '${req.body.thumbnail}', '1')`, function (error, results, fields) {
        if (error) throw res.send(error);
        return res.status(200).json({ data: results });
      });
  }

  static findAll(req, res) {
    dbConn.query(`SELECT * FROM tbl_event`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

  static findOne(req, res) {
    dbConn.query(`SELECT * FROM tbl_event WHERE event_id=${req.params.id}`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

  static delete(req, res) {
    dbConn.query(`DELETE FROM tbl_event WHERE event_id=${req.params.id}`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

  static update(req, res) {
    dbConn.query(`UPDATE tbl_event SET event_name='${req.body.event_name}', description='${req.body.description}', start_date='${req.body.start_date}', end_date='${req.body.end_date}', location'${req.body.location}', thumbnail='${req.body.thumbnail}' WHERE event_id=${req.params.id}`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

}

module.exports = news
