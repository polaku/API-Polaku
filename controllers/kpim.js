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
            user_id: req.body.user_id,
            is_inverse: req.body.is_inverse
          }

          let createKPIM = await tbl_kpims.create(newKPIMScore)

          if (createKPIM) {
            await targetPerbulan.forEach(async (element, index) => {
              if (element.target_monthly !== 0 || element.target_monthly) {
                let newData = {
                  kpim_id: createKPIM.null,
                  month: index + 1,
                  target_monthly: +element.target_monthly || 0
                }
                let check = await tbl_kpim_scores.create(newData)
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
          let newKPIMScore = {
            indicator_kpim: req.body.indicator_kpim,
            target: req.body.target,
            unit: req.body.unit,
            year: req.body.year,
            user_id: req.body.user_id,
            is_inverse: req.body.is_inverse
          }

          let createKPIM = await tbl_kpims.create(newKPIMScore)

          if (createKPIM) {
            await targetPerbulan.forEach(async (element, index) => {
              if (element.target_monthly !== 0 || element.target_monthly) {
                let newData = {
                  kpim_id: createKPIM.null,
                  month: index + 1,
                  target_monthly: +element.target_monthly || 0
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

  static async findAll(req, res) {
    let situationKPIM, listBawahan, situationBawahanId = []

    if (req.query["for-setting"] === "true") {
      listBawahan = await tbl_account_details.findAll({ where: { name_evaluator_1: req.user.user_id } })

      await listBawahan.forEach(el => {
        situationBawahanId.push({ user_id: el.user_id })
      })

      situationKPIM = {
        where: {
          [Op.and]: [
            { year: req.query.year },
            {
              [Op.or]: situationBawahanId
            }
          ]
        },
        attributes: {
          exclude: ['created_at']
        },
        include: [
          {
            model: tbl_users,
            attributes: {
              exclude: ['user_id', 'password', 'flag_password']
            },
            include: [{
              // as: "tbl_account_detail",
              model: tbl_account_details,
              attributes: ['fullname', 'avatar', 'nik', 'company_id', 'initial'],
              include: [{
                model: tbl_users,
                as: "idEvaluator1",
                attributes: ['user_id', 'username'],
                include: [{
                  model: tbl_account_details,
                  attributes: ['fullname', 'avatar', 'nik', 'company_id', 'initial']
                }]
              }]
            }]
          },
          {
            model: tbl_kpim_scores,
            where: {
              [Op.or]: [
                { month: Number(req.query.month) },
                { month: Number(req.query.month) - 1 }
              ]
            },
            order: [
              ['month', 'ASC']
            ]
          }
        ],
        order: [
          ['created_at', 'DESC'],
          ['user_id', 'ASC'],
          ['year', 'ASC'],
        ],
      }
    } else if (req.query["for-dashboard"] === "true") {
      listBawahan = await tbl_account_details.findAll({ where: { name_evaluator_1: req.query['user-id'] } })

      situationBawahanId.push({ user_id: req.query['user-id'] })
      await listBawahan.forEach(el => {
        situationBawahanId.push({ user_id: el.user_id })
      })

      situationKPIM = {
        where: {
          [Op.and]: [
            { year: req.query.year },
            // {
            //   [Op.or]: situationBawahanId
            // },
            { user_id: req.query['user-id'] }
          ]
        },
        attributes: {
          exclude: ['created_at']
        },
        include: [
          {
            model: tbl_users,
            attributes: {
              exclude: ['user_id', 'password', 'flag_password']
            },
            include: [{
              // as: "tbl_account_detail",
              model: tbl_account_details,
              attributes: ['fullname', 'avatar', 'nik', 'company_id', 'initial'],
              include: [{
                model: tbl_users,
                as: "idEvaluator1",
                attributes: ['user_id', 'username'],
                include: [{
                  // as: "tbl_account_detail",
                  model: tbl_account_details,
                  attributes: ['fullname', 'avatar', 'nik', 'company_id', 'initial']
                }]
              }]
            }]
          },
          {
            model: tbl_kpim_scores,
            where: {
              [Op.or]: [
                { month: Number(req.query.month) - 1 },
                { month: Number(req.query.month) }

              ]
            },
            order: [
              ['month', 'ASC']
            ]
          }
        ],
        order: [
          ['created_at', 'DESC'],
          ['user_id', 'ASC'],
          ['year', 'ASC'],
        ],
      }
    } else if (req.query["for-report"] === "true") {
      situationKPIM = {
        where: {
          year: req.query.year
        },
        attributes: {
          exclude: ['created_at']
        },
        include: [
          {
            model: tbl_users,
            attributes: {
              exclude: ['user_id', 'password', 'flag_password']
            },
            include: [{
              // as: "tbl_account_detail",
              model: tbl_account_details,
              attributes: ['fullname', 'avatar', 'nik', 'company_id', 'initial'],
              include: [{
                model: tbl_users,
                as: "idEvaluator1",
                attributes: ['user_id', 'username'],
                include: [{
                  // as: "tbl_account_detail",
                  model: tbl_account_details,
                  attributes: ['fullname', 'avatar', 'nik', 'company_id', 'initial']
                }]
              }]
            }]
          },
          {
            required: true,
            model: tbl_kpim_scores,
            where: {
              month: Number(req.query.month),
              hasConfirm: 1
            },
            order: [
              ['month', 'ASC']
            ]
          }
        ],
        order: [
          ['created_at', 'DESC'],
          ['user_id', 'ASC'],
          ['year', 'ASC'],
        ],
      }
    } else if (req.query.year) {
      situationKPIM = {
        where: { year: req.query.year },
        include: [
          {
            model: tbl_users,
            include: [{
              // as: "tbl_account_detail",
              model: tbl_account_details,
              include: [{
                model: tbl_users,
                as: "idEvaluator1",
                include: [{
                  // as: "tbl_account_detail",
                  model: tbl_account_details
                }]
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
          model: tbl_users,
          include: [{
            // as: "tbl_account_detail",
            model: tbl_account_details,
            include: [{
              model: tbl_users,
              as: "idEvaluator1",
              include: [{
                // as: "tbl_account_detail",
                model: tbl_account_details
              }]
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
        let allTAL
        if (req.query["for-setting"] === "true") {
          allTAL = await tbl_tals.findAll({
            where: { [Op.or]: situationBawahanId },
            include: [{
              model: tbl_tal_scores,
              where: {
                month: req.query.month,
                week: req.query.week,
                year: req.query.year,
              },
              order: [
                ['week', 'ASC']
              ]
            }]
          })
        } else if (req.query["for-report"] === "true") {
          allTAL = await tbl_tals.findAll({
            include: [{
              required: true,
              model: tbl_tal_scores,
              where: {
                month: req.query.month,
                year: req.query.year,
                hasConfirm: 1
              }
            }]
          })
        } else {
          allTAL = await tbl_tals.findAll({
            where: { user_id: req.query['user-id'] },
            include: [{
              model: tbl_tal_scores,
              where: {
                month: req.query.month,
                week: req.query.week,
                year: req.query.year,
              },
              order: [
                ['week', 'ASC']
              ]
            }]
          })
        }

        if (req.query["for-report"] === "true") {
          await data.forEach(async element => {
            if (element.indicator_kpim.toLowerCase() === 'tal') {
              element.tbl_kpim_scores[0].dataValues.tbl_tals = await allTAL.filter(tal => tal.user_id === element.user_id)
            }
          });
        } else {
          await data.forEach(async el => {
            el.tbl_kpim_scores.sort(compareMonth)
          })

          await data.forEach(async element => {
            if (element.indicator_kpim.toLowerCase() === 'tal') {
              element.tbl_kpim_scores[element.tbl_kpim_scores.length - 1].dataValues.tbl_tals = await allTAL.filter(tal => tal.user_id === element.user_id)
            }
          });
        }

        res.status(200).json({ message: "Success", total_record: data.length, data })
      })
      .catch(err => {
        let error = {
          uri: `http://api.polagroup.co.id/events/all`,
          method: 'get',
          status: 500,
          message: err,
          user_id: req.query['user-id']
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
    let targetPerbulan, statusKhusus = false//khusus nilai invert
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
          let targetMonthly = Number(req.body.target_monthly) || Number(kpimMonth.target_monthly)
          let capaianMonthly = Number(req.body.pencapaian_monthly) || Number(kpimMonth.pencapaian_monthly)

          if (kpimSelected.unit.toLowerCase() === "keluhan" || kpimSelected.unit.toLowerCase() === "komplen" || kpimSelected.unit.toLowerCase() === "complain" || kpimSelected.unit.toLowerCase() === "reject" || kpimSelected.is_inverse) {
            statusKhusus = true
            if (targetMonthly < capaianMonthly) {
              newScore = 0
            } else {
              newScore = ((targetMonthly - capaianMonthly) / targetMonthly) * 100
            }
          } else {
            newScore = (capaianMonthly / targetMonthly) * 100
          }

          let newData = {
            target_monthly: req.body.target_monthly,
            bobot: req.body.bobot,
            pencapaian_monthly: req.body.pencapaian_monthly,
          }

          if (kpimSelected.indicator_kpim.toLowerCase() !== "tal") newData.score_kpim_monthly = newScore

          let updateKPIMScore = await tbl_kpim_scores.update(newData, { where: { kpim_score_id: req.params.id } })

          if (updateKPIMScore) {
            if (req.body.pencapaian_monthly || statusKhusus) { //for update pencapaian kpim tahunan
              let kpimOneYear = await tbl_kpim_scores.findAll({ where: { kpim_id: kpimMonth.kpim_id } })
              let tempScore = 0
              kpimOneYear.forEach(kpimScore => {
                tempScore += kpimScore.pencapaian_monthly
              })

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

        if (updateKPIM && req.body.monthly) {
          await targetPerbulan.forEach(async (element, index) => {
            if (+req.body.month > index) {
              let newData = {
                bobot: element.bobot,
                target_monthly: +element.target_monthly,
                pencapaian_monthly: +element.pencapaian_monthly
              }
              let targetMonthly = +element.target_monthly
              let capaianMonthly = +element.pencapaian_monthly

              if (req.body.is_inverse) {
                statusKhusus = true

                if (targetMonthly < capaianMonthly) {
                  newData.score_kpim_monthly = 0
                } else {
                  newData.score_kpim_monthly = ((targetMonthly - capaianMonthly) / targetMonthly) * 100
                }
              } else {
                newData.score_kpim_monthly = (capaianMonthly / targetMonthly) * 100
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
            }
          });
          let kpimSelected = await tbl_kpims.findByPk(req.params.id)

          await inputNilaiKPIMTeam(kpimSelected.user_id, kpimSelected.year, req.body.month)
        }
        res.status(200).json({ message: "Success", data: updateKPIM })
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
    let arrayKPIMScoreId = null, tal, day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    try {
      console.log(req.body)
      if (typeof req.body.arrayKPIMScoreId === 'object') arrayKPIMScoreId = req.body.arrayKPIMScoreId
      else arrayKPIMScoreId = JSON.parse(req.body.arrayKPIMScoreId)

      await arrayKPIMScoreId.forEach(async kpimScoreId => {
        // HANDLE KPIM BULANAN
        await tbl_kpim_scores.update({ hasConfirm: 1 }, { where: { kpim_score_id: kpimScoreId } })

        let kpimScore = await tbl_kpim_scores.findByPk(kpimScoreId)

        // UNTUK TANGGAL PENILAIAN 21 - 20
        // let kpim = await tbl_kpims.findByPk(kpimScore.kpim_id)
        // let weekDate20 = await getNumberOfWeek(`${kpim.year}-${kpimScore.month}-20`)

        tal = await tbl_tals.findAll({
          where: { kpim_score_id: kpimScoreId },
          include: [{ model: tbl_tal_scores, where: { month: kpimScore.month } }]
        })

        tal.forEach(async el => {
          await tbl_tal_scores.update({ hasConfirm: 1 }, { where: { tal_id: el.tal_id, month: kpimScore.month } })

          // UNTUK TANGGAL PENILAIAN 21 - 20
          // await tbl_tal_scores.update({ hasConfirm: 1 }, { where: { tal_id: el.tal_id, month: kpimScore.month, week: { [Op.lt]: weekDate20 } } })
          // el.tbl_tal_scores.forEach(async tal_score => {
          //   if (tal_score.month === kpimScore.month && tal_score.week === weekDate20 && ((tal_score.when_day && day.indexOf(tal_score.when_day) <= new Date(`${kpim.year}-${kpimScore.month}-20`).getDay()) || (tal_score.when_date && Number(tal_score.when_date) <= 20))) {
          //     await tbl_tal_scores.update({ hasConfirm: 1 }, { where: { tal_score_id: tal_score.tal_score_id } })
          //   }
          // })
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

  static async sendGradeOneYear(req, res) {
    try {
      if (req.user.user_id === 1) {
        let allKPIMinYear = await tbl_kpims.findAll({ where: { year: req.query.year }, include: [{ model: tbl_kpim_scores }] })
        await allKPIMinYear.forEach(async (el) => {
          await el.tbl_kpim_scores.forEach(async (kpimScore) => {
            await tbl_kpim_scores.update({ hasConfirm: 1 }, { where: { kpim_score_id: kpimScore.kpim_score_id } })
          })
        })
        await tbl_tal_scores.update({ hasConfirm: 1 }, { where: { year: req.query.year } })

        res.status(200).json({ message: "Success" })
      } else {
        res.status(400).json({ message: "Not Authorize" })
      }
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
    let newKPIMTEAM = await tbl_kpims.create(newKPIM)

    if (newKPIMTEAM) {
      for (let i = month; i <= 12; i++) {
        let newData = {
          kpim_id: newKPIMTEAM.null,
          month: i,
          target_monthly: 0
        }
        await tbl_kpim_scores.create(newData)
      }
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

// CALENDER GOOGLE
// function getNumberOfWeek(date) {
//   //yyyy-mm-dd (first date in week)
//   var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
//   var dayNum = d.getUTCDay() || 7;
//   d.setUTCDate(d.getUTCDate() + 4 - dayNum);
//   var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
//   return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
// }

function compareMonth(a, b) {
  if (Number(a.month) < Number(b.month)) {
    return -1;
  }
  if (Number(a.month) > Number(b.month)) {
    return 1;
  }
  return 0;
}

module.exports = kpim