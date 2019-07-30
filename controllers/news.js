const { dbConn } = require('../config')

class announcements {
  static create(req, res) {
    dbConn.query(`INSERT INTO tbl_polanews (title, description, created_by, attachments, status) VALUES ( '${req.body.title}','${req.body.description}', '1', '${req.body.attachments}', '${req.body.status}')`, function (error, results, fields) {
        if (error) throw res.send(error);
        return res.status(200).json({ data: results });
      });
  }

  static findAll(req, res) {
    dbConn.query(`SELECT * FROM tbl_polanews`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

  static findOne(req, res) {
    dbConn.query(`SELECT * FROM tbl_polanews WHERE polanews_id=${req.params.id}`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

  static delete(req, res) {
    dbConn.query(`DELETE FROM tbl_polanews WHERE polanews_id=${req.params.id}`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

  static update(req, res) {
    dbConn.query(`UPDATE tbl_polanews SET title='${req.body.title}', description='${req.body.description}', attachments='${req.body.attachments}', status='${req.body.status}' WHERE polanews_id=${req.params.id}`, function (error, results, fields) {
      if (error) throw res.send(error);
      return res.status(200).json({ data: results });
    });
  }

}

module.exports = announcements