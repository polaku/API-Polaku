const { tbl_kpims, tbl_kpim_scores, tbl_users, tbl_account_details, tbl_tals, tbl_tal_scores } = require('../models')
const logError = require('../helpers/logError')
const Op = require("sequelize").Op;
const inputNilaiKPIMTeam = require('../helpers/inputKPIMTEAM')

class kpim {
  static async create(req, res) {
    try {
      let targetPerbulan

      if (req.body.monthly) {
        if (typeof req.body.monthly === 'object') targetPerbulan = req.body.monthly
        else targetPerbulan = JSON.parse(req.body.monthly)
      }

      //cek TAL bulan sudah ada atau belum
      let talMonth = await tbl_kpims.findOne({
        where: {
          indicator_kpim: 'TAL', year: req.body.year, user_id: req.body.user_id
        },
        include: [{ model: tbl_kpim_scores }],
        order: [
          [tbl_kpim_scores, 'month', 'ASC']
        ],
      })

      await createKPIMTeam(req.body.user_id, req.body.year, req.body.month)

      if (talMonth) { //JIKA SUDAH ADA TAL DI TAHUN TSB
        if (req.body.indicator_kpim.toLowerCase() === "tal") {
          if (!talMonth.tbl_kpim_scores[0]) {
            for (let i = req.body.month; i < 12; i++) {
              let newData = {
                kpim_id: talMonth.kpim_id,
                month: i,
                target_monthly: 0
              }
              await tbl_kpim_scores.create(newData)
            }

            let dataReturn = await tbl_kpims.findByPk(talMonth.kpim_id, {
              include: [{ model: tbl_kpim_scores }],
              order: [
                [tbl_kpim_scores, 'month', 'ASC']
              ],
            })

            await inputNilaiKPIMTeam(req.body.user_id, req.body.year, req.body.month)

            res.status(201).json({ message: "Success", data: dataReturn })
          } else if (req.body.month < talMonth.tbl_kpim_scores[0].month) {
            for (let i = req.body.month; i < talMonth.tbl_kpim_scores[0].month; i++) {
              let newData = {
                kpim_id: talMonth.kpim_id,
                month: i,
                target_monthly: 0
              }
              await tbl_kpim_scores.create(newData)
            }

            let dataReturn = await tbl_kpims.findByPk(talMonth.kpim_id, {
              include: [{ model: tbl_kpim_scores }],
              order: [
                [tbl_kpim_scores, 'month', 'ASC']
              ],
            })

            await inputNilaiKPIMTeam(req.body.user_id, req.body.year, req.body.month)

            res.status(201).json({ message: "Success", data: dataReturn })
          } else {
            res.status(400).json({ message: "Error" })
          }
        } else {
          if (talMonth.tbl_kpim_scores[0].month > req.body.month) {
            for (let i = req.body.month; i < talMonth.tbl_kpim_scores[0].month; i++) {
              let newData = {
                kpim_id: talMonth.kpim_id,
                month: i,
                target_monthly: 0
              }
              await tbl_kpim_scores.create(newData)
            }
          }

          let newKPIMScore = {
            indicator_kpim: req.body.indicator_kpim,
            target: req.body.target,
            unit: req.body.unit,
            year: req.body.year,
            user_id: req.body.user_id
          }

          let createKPIM = await tbl_kpims.create(newKPIMScore)

          if (createKPIM) {
            await targetPerbulan.forEach(async (element, index) => {
              if (element !== 0 || element) {
                let newData = {
                  kpim_id: createKPIM.null,
                  month: index + 1,
                  target_monthly: element || 0
                }
                await tbl_kpim_scores.create(newData)
              }
            });

            await inputNilaiKPIMTeam(req.body.user_id, req.body.year, req.body.month)

            createKPIM.kpim_id = createKPIM.null
            res.status(201).json({ message: "Success", data: createKPIM })
          }
        }
      } else { //JIKA BELUM ADA TAL DI TAHUN TSB
        if (req.body.indicator_kpim.toLowerCase() === "tal") {
          let newKPIM = {
            indicator_kpim: 'TAL',
            unit: 'point',
            year: req.body.year,
            user_id: req.body.user_id
          }
          let tal = await tbl_kpims.create(newKPIM)

          if (tal) {
            for (let i = req.body.month; i <= 12; i++) {
              let newData = {
                kpim_id: tal.null,
                month: i,
                target_monthly: 0
              }
              await tbl_kpim_scores.create(newData)
            }
          }

          await inputNilaiKPIMTeam(req.body.user_id, req.body.year, req.body.month)

          res.status(201).json({ message: "Success", data: tal })

        } else {
          let newKPIM = {
            indicator_kpim: 'TAL',
            unit: 'point',
            year: req.body.year,
            user_id: req.body.user_id
          }
          let tal = await tbl_kpims.create(newKPIM)

          if (tal) {
            await targetPerbulan.forEach(async (element, index) => {
              if (Number(element) !== 0) {
                let newData = {
                  kpim_id: tal.null,
                  month: index + 1,
                  target_monthly: 0
                }
                await tbl_kpim_scores.create(newData)
              }
            });
          }

          let newKPIMScore = {
            indicator_kpim: req.body.indicator_kpim,
            target: req.body.target,
            unit: req.body.unit,
            year: req.body.year,
            user_id: req.body.user_id
          }

          let createKPIM = await tbl_kpims.create(newKPIMScore)

          if (createKPIM) {
            await targetPerbulan.forEach(async (element, index) => {
              if (element !== 0 || element) {
                let newData = {
                  kpim_id: createKPIM.null,
                  month: index + 1,
                  target_monthly: element || 0
                }
                await tbl_kpim_scores.create(newData)
              }
            });

            await inputNilaiKPIMTeam(req.body.user_id, req.body.year, req.body.month)

            createKPIM.kpim_id = createKPIM.null
            res.status(201).json({ message: "Success", data: createKPIM })
          }
        }

      }
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

  static findAll(req, res) {
    let situationKPIM

    if (req.query.year) {
      situationKPIM = {
        where: { year: req.query.year },
        include: [
          {
            model: tbl_users, include: [{
              model: tbl_account_details, include: [{
                model: tbl_users, as: "idEvaluator1", include: [{ model: tbl_account_details }]
              }]
            }]
          }
        ],
        order: [
          ['created_at', 'DESC'],
          ['user_id', 'ASC'],
          ['year', 'ASC'],
        ],
      }
    } else {
      situationKPIM = {
        include: [{
          model: tbl_users, include: [{
            model: tbl_account_details, include: [{
              model: tbl_users, as: "idEvaluator1", include: [{ model: tbl_account_details }]
            }]
          }]
        }],
        order: [
          ['created_at', 'DESC'],
          ['user_id', 'ASC'],
          ['year', 'ASC'],
        ],
      }
    }

    tbl_kpims.findAll(situationKPIM)
      .then(async data => {
        let kpimScore = await tbl_kpim_scores.findAll({
          include: [
            { model: tbl_tals, include: [{ model: tbl_tal_scores }] }
          ]
        })

        await data.forEach(async element => {
          let KPIMScore = await kpimScore.filter(el => (el.kpim_id === element.kpim_id))
          element.dataValues.kpimScore = KPIMScore
        });

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

  static findOne(req, res) {

    tbl_kpims.findByPk(req.params.id)
      .then(async data => {
        let kpimScore = await tbl_kpim_scores.findAll({
          where: { kpim_id: req.params.id },
          order: [
            ['kpim_score_id', 'ASC']
          ]
        })
        // console.log(kpimScore)
        data.dataValues.kpimScore = kpimScore

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

  static async update(req, res) {
    let targetPerbulan
    try {

      if (req.query.update === "month") { // khusus KPIM Month
        let kpimMonth = await tbl_kpim_scores.findByPk(req.params.id)
        let kpimSelected = await tbl_kpims.findByPk(kpimMonth.kpim_id)
        let totalBobotAfter = 0

        if (req.body.bobot) {
          let allKPIMUser = await tbl_kpims.findAll({ where: { user_id: kpimSelected.user_id, year: kpimSelected.year }, include: [{ model: tbl_kpim_scores, where: { month: kpimMonth.month } }] })

          allKPIMUser.forEach(kpim => { //
            if (Number(kpim.tbl_kpim_scores[0].kpim_score_id) === Number(req.params.id)) {
              kpim.tbl_kpim_scores[0].bobot = req.body.bobot
            }
            totalBobotAfter += Number(kpim.tbl_kpim_scores[0].bobot)
          })
        }

        if (totalBobotAfter <= 100 || !req.body.bobot) {
          //for update kpim_score kpim newest
          let newScore

          if (kpimSelected.unit.toLowerCase() === "keluhan" || kpimSelected.unit.toLowerCase() === "komplen" || kpimSelected.unit.toLowerCase() === "complain" || kpimSelected.unit.toLowerCase() === "reject") {
            console.log("MASUK 1")
            newScore = (((Number(req.body.target_monthly) || Number(kpimMonth.target_monthly)) - (Number(req.body.pencapaian_monthly) || Number(kpimMonth.pencapaian_monthly))) / (Number(req.body.target_monthly) || Number(kpimMonth.target_monthly))) * 100
          } else {
            console.log("MASUK 2")
            newScore = ((Number(req.body.pencapaian_monthly) || Number(kpimMonth.pencapaian_monthly)) / (Number(req.body.target_monthly) || Number(kpimMonth.target_monthly))) * 100
          }
          console.log("req.body", req.body)
          let newData = {
            target_monthly: req.body.target_monthly,
            bobot: req.body.bobot,
            pencapaian_monthly: req.body.pencapaian_monthly,
          }

          if (kpimSelected.indicator_kpim.toLowerCase() !== "tal") newData.score_kpim_monthly = newScore

          console.log("newData", newData)
          console.log("kpim_score_id", req.params.id)
          let updateKPIMScore = await tbl_kpim_scores.update(newData, { where: { kpim_score_id: req.params.id } })

          if (updateKPIMScore) {
            console.log("MASUK 3")
            if (req.body.pencapaian_monthly) { //for update pencapaian kpim tahunan
            console.log("MASUK 4")
              let kpimOneYear = await tbl_kpim_scores.findAll({ where: { kpim_id: kpimMonth.kpim_id } })
              let tempScore = 0
              kpimOneYear.forEach(kpimScore => {
                tempScore += kpimScore.pencapaian_monthly
              })

              console.log("tempScore", tempScore)
              console.log("kpimMonth.kpim_id", kpimMonth.kpim_id)
              await tbl_kpims.update({ pencapaian: tempScore }, { where: { kpim_id: kpimMonth.kpim_id } })
            }

            inputNilaiKPIMTeam(kpimSelected.user_id, kpimSelected.year, kpimMonth.month, 'atas')
            res.status(200).json({ message: "Success", data: updateKPIMScore })
          }
        } else {
          throw { Error: "Total bobot lebih dari 100%" }
        }

      } else {
        if (typeof req.body.monthly === 'object') targetPerbulan = req.body.monthly
        else targetPerbulan = JSON.parse(req.body.monthly)

        let newKPIM = {
          indicator_kpim: req.body.indicator_kpim,
          target: req.body.target,
          unit: req.body.unit,
        }

        let updateKPIM = await tbl_kpims.update(newKPIM, { where: { kpim_id: req.params.id } })

        if (updateKPIM) {
          await targetPerbulan.forEach(async (element, index) => {

            let newData = {
              bobot: element.bobot,
              target_monthly: element.target_monthly,
              pencapaian_monthly: element.pencapaian_monthly,
              score_kpim_monthly: ((Number(element.pencapaian_monthly) / Number(element.target_monthly)) * 100)
            }

            let updateKPIMScore = await tbl_kpim_scores.update(newData, { where: { kpim_score_id: element.kpim_score_id } })

            if (updateKPIMScore) {
              let kpimOneYear = await tbl_kpim_scores.findAll({ where: { kpim_id: req.params.id } })
              let tempScore = 0
              kpimOneYear.forEach(kpimScore => {
                tempScore += kpimScore.pencapaian_monthly
              })
              await tbl_kpims.update({ pencapaian: tempScore }, { where: { kpim_id: req.params.id } })
            }
          });
          let kpimSelected = await tbl_kpims.findByPk(req.params.id)

          await inputNilaiKPIMTeam(kpimSelected.user_id, kpimSelected.year, req.body.month)

          res.status(200).json({ message: "Success", data: updateKPIM })
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
        if (req.query.delete === 'month') {
          let kpimScoreSisa = null
          let kpimScoreSelected = await tbl_kpim_scores.findByPk(req.params.id)

          let deleteKPIMScore = await tbl_kpim_scores.destroy({ where: { kpim_id: kpimScoreSelected.kpim_id, month: { [Op.gte]: kpimScoreSelected.month } } })

          if (deleteKPIMScore) {
            kpimScoreSisa = await tbl_kpim_scores.findAll({ where: { kpim_id: kpimScoreSelected.kpim_id } })

            if (kpimScoreSisa.length === 0) {
              await tbl_kpims.destroy({ where: { kpim_id: kpimScoreSelected.kpim_id } })
            }

            res.status(200).json({ message: "Success", idDeleted: req.params.id })
          }
        }
      } else {
        let deleteKPIM = await tbl_kpims.destroy({ where: { kpim_id: req.params.id } })
        if (deleteKPIM) {
          await tbl_kpim_scores.destroy({ where: { kpim_id: req.params.id } })
          res.status(200).json({ message: "Success", idDeleted: req.params.id })
        }
      }

    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

  static async sendGrade(req, res) {
    let arrayKPIMScoreId = null
    try {
      if (typeof req.body.arrayKPIMScoreId === 'object') arrayKPIMScoreId = req.body.arrayKPIMScoreId
      else arrayKPIMScoreId = JSON.parse(req.body.arrayKPIMScoreId)

      arrayKPIMScoreId.forEach(async kpimScoreId => {

        await tbl_kpim_scores.update({ hasConfirm: 1 }, { where: { kpim_score_id: kpimScoreId } })

        let kpimScore = await tbl_kpim_scores.findByPk(kpimScoreId)

        let tal = await tbl_tals.findAll({ where: { kpim_score_id: kpimScoreId } })

        tal.forEach(async el => {
          await tbl_tal_scores.update({ hasConfirm: 1 }, { where: { tal_id: el.tal_id, month: kpimScore.month } })
        })
      })


      res.status(200).json({ message: "Success" })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

  static async calculateKPIMTEAM(req, res) {
    try {
      await inputNilaiKPIMTeam(req.user.user_id, req.body.year, req.body.month)
      res.status(200).json({ message: "Success" })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }
}


async function createKPIMTeam(userIdBawahan, year, month) {
  let userDetail = await tbl_account_details.findOne({ where: { user_id: userIdBawahan } })

  let evaluator1 = await tbl_account_details.findOne({ where: { user_id: userDetail.name_evaluator_1 } })

  let KPIM_team = await tbl_kpims.findOne({
    where: {
      indicator_kpim: 'KPIM TEAM', year, user_id: evaluator1.user_id
    },
    include: [{ model: tbl_kpim_scores }],
    order: [
      [tbl_kpim_scores, 'month', 'ASC']
    ],
  })

  if (KPIM_team) {
    if (KPIM_team.tbl_kpim_scores[0].month > month) {
      for (let i = month; i < KPIM_team.tbl_kpim_scores[0].month; i++) {
        let newData = {
          kpim_id: KPIM_team.kpim_id,
          month: i,
          target_monthly: 0
        }
        await tbl_kpim_scores.create(newData)
      }
    }
  } else {
    let newKPIM = {
      indicator_kpim: 'KPIM TEAM',
      unit: 'point',
      year: year,
      user_id: evaluator1.user_id
    }
    let tal = await tbl_kpims.create(newKPIM)

    if (tal) {
      for (let i = month; i <= 12; i++) {
        let newData = {
          kpim_id: tal.null,
          month: i,
          target_monthly: 0
        }
        await tbl_kpim_scores.create(newData)
      }
    }
    console.log("Belum Ada KPIM TEAM")
  }
}

// async function inputNilaiKPIMTeam(userIdBawahan, year, month, ket) {

//   let counterUserKPIM = 0, tempKPIM = [], tempScoreKPIM = 0

//   let userDetail = await tbl_account_details.findOne({ where: { user_id: userIdBawahan } })

//   let bawahan = await tbl_account_details.findAll({ where: { name_evaluator_1: userDetail.name_evaluator_1 } })
//   let allKPIM = await tbl_kpims.findAll({ where: { year }, include: [{ model: tbl_kpim_scores, where: { month } }] })

//   bawahan && await bawahan.forEach(async element => { //fetch kpim per user
//     let newKPIM = []

//     newKPIM = allKPIM.filter(el => el.user_id === element.user_id)
//     tempKPIM = [...tempKPIM, ...newKPIM]
//     if (newKPIM.length > 0) counterUserKPIM++

//   });

//   tempKPIM.forEach(kpimMonth => {
//     tempScoreKPIM += kpimMonth.tbl_kpim_scores[0].score_kpim_monthly * (Number(kpimMonth.tbl_kpim_scores[0].bobot) / 100)
//   })

//   let scoreKPIMTEAM = Math.ceil(tempScoreKPIM / counterUserKPIM)

//   console.log("score KPIM total", tempScoreKPIM)
//   console.log("counterUserKPIM", counterUserKPIM)
//   console.log("score KPIM TEAM", scoreKPIMTEAM)

//   let kpimTEAMmonthselected = await tbl_kpims.findOne({ where: { indicator_kpim: 'KPIM TEAM', year, user_id: userDetail.name_evaluator_1 }, include: [{ model: tbl_kpim_scores, where: { month } }] })

//   kpimTEAMmonthselected && await tbl_kpim_scores.update({ score_kpim_monthly: scoreKPIMTEAM }, { where: { kpim_score_id: kpimTEAMmonthselected.tbl_kpim_scores[0].kpim_score_id } })

//   return tempKPIM

// }

module.exports = kpim