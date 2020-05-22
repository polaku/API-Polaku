const { tbl_tals, tbl_users, tbl_account_details, tbl_tal_scores, tbl_kpim_scores, tbl_kpims } = require('../models')
const logError = require('../helpers/logError')
const { mailOptions, transporter } = require('../helpers/nodemailer')
const inputNilaiKPIMTeam = require('../helpers/inputKPIMTEAM')

const Op = require("sequelize").Op

class tal {
  static async create(req, res) {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

    let tal = await tbl_tals.create({ indicator_tal: req.body.indicator_tal, user_id: req.body.user_id, kpim_score_id: req.body.kpim_score_id })

    tal.tal_id = tal.null
    if (Number(req.body.isRepeat) === 0) { //INDICATOR TAL TIDAK BERULANG
      let tempScoreTal = null

      if (req.body.weight && req.body.achievement) {
        tempScoreTal = Number(req.body.achievement) * (Number(req.body.weight) / 100)
      }

      let newData = {
        weight: req.body.weight,
        week: req.body.week,
        month: req.body.month,
        year: req.body.year,
        tal_id: tal.tal_id,
        load: req.body.load,
        achievement: req.body.achievement,
        link: req.body.link,
        score_tal: tempScoreTal
      }

      if (Number(req.body.forDay) === 1) { //TAL HARI
        newData.when_day = req.body.time
      } else { //TAL TANGGAL
        newData.when_date = req.body.time
      }

      tbl_tal_scores.create(newData)
        .then(async data => {
          data.tal_id = data.null

          // ========== UPDATE KPIM SCORE (START)  ========== 
          // let KPIMScoreSelected = await tbl_kpim_scores.findByPk(req.body.kpim_score_id)

          // let KPIMSelected = await tbl_kpims.findByPk(KPIMScoreSelected.kpim_id)

          let allTALUser = await tbl_tals.findAll({
            where: { user_id: req.body.user_id },
            include: [{ model: tbl_tal_scores, where: { month: req.body.month, year: req.body.year } }]
          })

          let tempScore = []

          allTALUser.forEach(tal => {
            tempScore = [...tempScore, ...tal.tbl_tal_scores]
          })

          await tempScore.sort(compare)

          let tempScoreTALweek = 0, tempWeekSelected = null, counterWeek = 0

          await tempScore.forEach((tal_score) => {

            if (tempWeekSelected !== tal_score.week) {
              tempWeekSelected = tal_score.week
              counterWeek++
            }

            tempScoreTALweek = tempScoreTALweek + tal_score.score_tal
          })

          await tbl_kpim_scores.update({ score_kpim_monthly: (tempScoreTALweek / counterWeek) }, { where: { kpim_score_id: req.body.kpim_score_id } })
          // ========== UPDATE KPIM SCORE (END)  ========== 

          if (req.user.user_id === req.body.user_id) {
            let bawahanUser = await tbl_users.findByPk(req.body.user_id, { include: [{ model: tbl_account_details }] })

            let atasanUser = await tbl_users.findByPk(bawahanUser.tbl_account_detail.name_evaluator_1)

            res.status(201).json({ message: 'Success', data: tal })
            if (atasanUser) {
              mailOptions.subject = "Notification!"
              mailOptions.to = atasanUser.email
              mailOptions.html = `Dear , <br/><br/>Sdr/i.  <b>${bawahanUser.tbl_account_detail.fullname}</b> telah menambahkan TAL baru dengan indicator <b>${req.body.indicator_tal}</b> diminggu ke <b>${req.body.week}</b> dibulan <b>${months[Number(req.body.month) - 1]}</b> tahun <b>${req.body.year}</b>.`

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  let error = {
                    uri: `http://api.polagroup.co.id/tal`,
                    method: 'post',
                    status: 0,
                    message: `Send email to ${atasanUser.username} (${atasanUser.email}) is error`,
                    user_id: req.user.user_id
                  }
                  logError(error)
                }
              })
            }

          } else {
            res.status(201).json({ message: 'Success', data: tal })
          }
        })
        .catch(err => {
          console.log(err)
          res.status(500).json(err)
        })

    } else { //INDICATOR TAL BERULANG
      let newData = {
        weight: req.body.weight,
        year: req.body.year,
        tal_id: tal.null,
      }
      let dataReturn = []
      try {
        let counterDate, i = req.body.week, tempMonth = req.body.month - 1


        if (Number(req.body.forDay) === 1) {
          let listDay = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']

          counterDate = req.body.firstDateInWeek + listDay.indexOf(req.body.time.toLowerCase())
        } else {
          counterDate = req.body.firstDateInWeek
        }

        let theDate = new Date(req.body.year, Number(req.body.month) - 1, counterDate)

        for (; i <= 53; i++) {
          let date = new Date(theDate.getFullYear(), theDate.getMonth(), counterDate)
          let month = date.getMonth() + 1

          newData.month = month
          console.log(i, date.getFullYear(), new Date(theDate).getFullYear(), date.getFullYear() === new Date(theDate).getFullYear())
          if (date.getFullYear() === new Date(theDate).getFullYear()) { //tidak lebih dari tahun tersebut
            console.log(date)
            if (Number(req.body.forDay) === 1) {
              newData.week = i
              newData.when_day = req.body.time

              let createTAL = await tbl_tal_scores.create(newData)
              createTAL.tal_id = createTAL.null
              dataReturn.push(createTAL)
            } else {
              if (month !== tempMonth) {
                newData.week = getNumberOfWeek(new Date(new Date(theDate).getFullYear(), month - 1, req.body.time))
                newData.when_date = req.body.time
                let createTAL = await tbl_tal_scores.create(newData)
                createTAL.tal_id = createTAL.null
                dataReturn.push(createTAL)
                tempMonth = month
              }
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
        order: [
          ['created_at', 'ASC'],
          ['year', 'ASC'],
        ],
      }
    } else {
      situation = {
        order: [
          ['created_at', 'ASC'],
          ['year', 'ASC'],
        ],
      }
    }

    tbl_tals.findAll({
      order: [
        ['tal_id', 'ASC'],
        ['user_id', 'ASC']
      ]
    })
      .then(async data => {
        let talScore = await tbl_tal_scores.findAll(situation)

        await data.forEach(async element => {
          let TALScore = await talScore.filter(el => (el.tal_id === element.tal_id))
          element.dataValues.talScore = TALScore
        })

        let dataReturn = await data.filter(el => el.dataValues.talScore.length > 0)

        res.status(200).json({ message: "Success", total_record: dataReturn.length, data: dataReturn })
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

  static async update(req, res) {

    try {
      if (req.body.indicator_tal) {//update tals
        let updateTAL = await tbl_tals.update({
          indicator_tal: req.body.indicator_tal
        }, { where: { tal_id: req.params.id } })

        if (updateTAL) res.status(200).json({ message: "Success", data })

      } else {
        let talScore = await tbl_tal_scores.findByPk(req.params.id)
        let talSelected = await tbl_tals.findByPk(talScore.tal_id)
        let tempTotalWeight = 0

        if (req.body.weight) {
          let allTALUser = await tbl_tals.findAll({ where: { user_id: talSelected.user_id }, include: [{ model: tbl_tal_scores, where: { year: talScore.year, month: talScore.month, week: talScore.week } }] })

          allTALUser.forEach(talScore => {
            if (talScore.tbl_tal_scores[0].tal_score_id === Number(req.params.id)) {
              talScore.tbl_tal_scores[0].weight = req.body.weight
            }

            tempTotalWeight += Number(talScore.tbl_tal_scores[0].weight)
          })
        }

        if (tempTotalWeight <= 100 || !req.body.weight) {
          let newScore = ((req.body.weight || Number(talScore.weight)) / 100) * (req.body.achievement || Number(talScore.achievement))

          let newData = {
            weight: req.body.weight,
            load: req.body.load,
            achievement: req.body.achievement,
            link: req.body.link,
            score_tal: newScore
          }

          if (req.body.time) {
            if (Number(req.body.forDay) === 1) {
              newData.when_day = req.body.time
              newData.when_date = ''
            } else {
              newData.when_day = ''
              newData.when_date = req.body.time
            }
          }

          let updateTAL = await tbl_tal_scores.update(newData, { where: { tal_score_id: req.params.id } })

          if (updateTAL && (req.body.achievement || req.body.weight)) {

            let updateScoreTAL = await updateScoreTALMonth(talSelected.kpim_score_id, talScore.month, talSelected.user_id)

            await inputNilaiKPIMTeam(updateScoreTAL.user_id, updateScoreTAL.year, talScore.month)
          }

          if (updateTAL) res.status(200).json({ message: "Success", data: updateTAL })

        } else {
          throw { Error: "Total bobot lebih dari 100%" }
        }
      }

    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }

  }

  static async delete(req, res) {
    try {
      if (req.query) {
        if (req.query.delete === 'week') {
          let talScoreSisa = null
          let talScoreSelected = await tbl_tal_scores.findByPk(req.params.id)

          let deleteTALScore = await tbl_tal_scores.destroy({ where: { tal_id: talScoreSelected.tal_id, week: { [Op.gte]: talScoreSelected.week } } })

          if (deleteTALScore) {
            talScoreSisa = await tbl_tal_scores.findAll({ where: { tal_id: talScoreSelected.tal_id } })

            if (talScoreSisa.length === 0) {
              await tbl_tals.destroy({ where: { tal_id: talScoreSelected.tal_id } })
            }

            res.status(200).json({ message: "Success", idDeleted: req.params.id })
          }
        }
      } else {
        let deleteTALs = await tbl_tals.destroy({ where: { tal_id: req.params.id } })
        if (deleteTALs) {
          await tbl_tal_scores.destroy({ where: { tal_id: req.params.id } })
          res.status(200).json({ message: "Success", idDeleted: req.params.id })
        }
      }

    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }
}

function getNumberOfWeek(date) {
  let theDay = date
  var target = new Date(theDay);
  var dayNr = (new Date(theDay).getDay() + 6) % 7;

  target.setDate(target.getDate() - dayNr + 3);

  var reference = new Date(target.getFullYear(), 0, 4);
  var dayDiff = (target - reference) / 86400000;
  var weekNr = 1 + Math.ceil(dayDiff / 7);

  return weekNr;
}

function compare(a, b) {
  if (Number(a.week) < Number(b.week)) {
    return -1;
  }
  if (Number(a.week) > Number(b.week)) {
    return 1;
  }
  return 0;
}

async function updateScoreTALMonth(kpimScoreId, month, userId) {
  let day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  let KPIMScoreSelected = await tbl_kpim_scores.findByPk(kpimScoreId)

  let KPIMScoreUpdate = await tbl_kpim_scores.findOne({ where: { kpim_id: KPIMScoreSelected.kpim_id, month } })

  let KPIMSelected = await tbl_kpims.findByPk(KPIMScoreSelected.kpim_id)

  let weekDate20 = await getNumberOfWeek(`${KPIMSelected.year}-${month}-20`)

  let allTALUser = await tbl_tals.findAll({
    where: { user_id: userId },
    include: [{ model: tbl_tal_scores, where: { month, year: KPIMSelected.year } }]
  })

  let tempScore = []

  allTALUser.forEach(tal => {
    tempScore = [...tempScore, ...tal.tbl_tal_scores]
  })

  await tempScore.sort(compare)

  let tempScoreTALweek = 0, tempWeekSelected = null, counterWeek = 0

  await tempScore.forEach((tal_score) => {

    if (tempWeekSelected !== tal_score.week && tal_score.week <= weekDate20) {
      tempWeekSelected = tal_score.week
      counterWeek++
    }
    if ((tal_score.month === month && tal_score.week < weekDate20) || (tal_score.month === month && tal_score.week === weekDate20 && ((tal_score.when_day && day.indexOf(tal_score.when_day) <= new Date(`${KPIMSelected.year}-${month}-20`).getDay()) || (tal_score.when_date && Number(tal_score.when_date) <= 20)))) {
    tempScoreTALweek = tempScoreTALweek + tal_score.score_tal
    }
  })

  await tbl_kpim_scores.update({ score_kpim_monthly: (tempScoreTALweek / counterWeek) }, { where: { kpim_score_id: KPIMScoreUpdate.kpim_score_id } })
  // ========== UPDATE KPIM SCORE (END)  ========== 

  return { user_id: KPIMSelected.user_id, year: KPIMSelected.year }
}

module.exports = tal