const { tbl_tals, tbl_users } = require('../models')

class tal {
  static async create(req, res) {
    if (Number(req.body.isRepeat) === 0) { //INDICATOR TAL TIDAK BERULANG
      let newData = {
        indicator_tal: req.body.indicator_tal,
        weight: req.body.weight,
        week: req.body.week,
        month: req.body.month,
        year: req.body.year,
        user_id: req.body.user_id
      }

      if (Number(req.body.forDay) === 1) { //TAL HARI
        newData.when_day = req.body.time
      } else { //TAL TANGGAL
        newData.when_date = req.body.time
      }

      tbl_tals.create(newData)
        .then(data => {
          data.tal_id = data.null
          res.status(201).json({ message: 'Success', data })
        })
        .catch(err => {
          res.status(500).json(err)
        })



    } else { //INDICATOR TAL BERULANG
      console.log("MASUK REPEAT")
      let newData = {
        indicator_tal: req.body.indicator_tal,
        weight: req.body.weight,
        year: req.body.year,
        user_id: req.body.user_id
      }
      let dataReturn = []
      try {
        let theDate = new Date(`${req.body.year}-${req.body.month}-${req.body.firstDateInWeek}`)
        let counterDate = req.body.firstDateInWeek, i = req.body.week, tempMonth = req.body.month - 1

        for (; i <= 53; i++) {
          let date = new Date(new Date(theDate).getFullYear(), new Date(theDate).getMonth(), counterDate)
          let month = date.getMonth() + 1

          newData.month = month

          if (Number(req.body.forDay) === 1) {
            newData.week = i
            newData.when_day = req.body.time

            let createTAL = await tbl_tals.create(newData)
            createTAL.tal_id = createTAL.null
            dataReturn.push(createTAL)
          } else {
            if (month !== tempMonth) {
              newData.week = getWeeks(new Date(new Date(theDate).getFullYear(), month-1, req.body.time))
              newData.when_date = req.body.time
              let createTAL = await tbl_tals.create(newData)
              createTAL.tal_id = createTAL.null
              dataReturn.push(createTAL)
              tempMonth = month
            }
          }

          counterDate += 7 //loop hari
        }

        res.status(201).json({ message: 'Success', data: dataReturn })
      } catch (err) {
        console.log(err)
        res.status(500).json(err)
      }
    }
  }

  static findAll(req, res) {
    let situation

    if (req.query.year) {
      situation = {
        where: { year: req.query.year },
        include: [{ model: tbl_users }],
        order: [
          ['created_at', 'DESC'],
          ['user_id', 'ASC'],
          ['year', 'ASC'],
        ],
      }
    } else {
      situation = {
        include: [{ model: tbl_users }],
        order: [
          ['created_at', 'DESC'],
          ['user_id', 'ASC'],
          ['year', 'ASC'],
        ],
      }
    }

    tbl_tals.findAll(situation)
      .then(async data => {

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
}


function getWeeks(date) {
  let theDay = date
  var target = new Date(theDay);
  var dayNr = (new Date(theDay).getDay() + 6) % 7;

  target.setDate(target.getDate() - dayNr + 3);

  var jan4 = new Date(target.getFullYear(), 0, 4);
  var dayDiff = (target - jan4) / 86400000;
  var weekNr = 1 + Math.ceil(dayDiff / 7);

  return weekNr;
}
module.exports = tal