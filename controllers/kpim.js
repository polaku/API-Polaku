const { tbl_kpims, tbl_kpim_scores, tbl_users } = require('../models')
const logError = require('../helpers/logError')

class kpim {
  static create(req, res) {
    let targetPerbulan

    if (typeof req.body.monthly === 'object') targetPerbulan = req.body.monthly
    else targetPerbulan = JSON.parse(req.body.monthly)

    let newKPIM = {
      indicator_kpim: req.body.indicator_kpim,
      target: req.body.target,
      unit: req.body.unit,
      year: req.body.year,
      user_id: req.body.user_id
    }
    tbl_kpims.create(newKPIM)
      .then(async data => {

        await targetPerbulan.forEach(async (element, index) => {
          let newData = {
            kpim_id: data.null,
            month: index + 1,
            target_monthly: element || 0
          }
          await tbl_kpim_scores.create(newData)
        });

        data.kpim_id = data.null
        res.status(201).json({ message: "Success", data })

      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
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

    tbl_kpims.findAll(situation)
      .then(async data => {
        let kpimScore = await tbl_kpim_scores.findAll({})

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

  static update(req, res) {
    let targetPerbulan

    if (typeof req.body.monthly === 'object') targetPerbulan = req.body.monthly
    else targetPerbulan = JSON.parse(req.body.monthly)


    let newKPIM = {
      indicator_kpim: req.body.indicator_kpim,
      target: req.body.target,
      unit: req.body.unit,
    }

    tbl_kpims.update(newKPIM, { where: { kpim_id: req.params.id } })
      .then(async data => {
        await targetPerbulan.forEach(async (element, index) => {
          let newData = {
            bobot: element.bobot,
            target_monthly: element.target_monthly,
            pencapaian_monthly: element.pencapaian_monthly
          }
          await tbl_kpim_scores.update(newData, { where: { kpim_score_id: element.kpim_score_id } })
        });

        res.status(200).json({ message: "Success", data })

      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
  }

  static delete(req, res) {
    tbl_kpims.destroy({ where: { kpim_id: req.params.id } })
      .then(async data => {
        await tbl_kpim_scores.destroy({ where: { kpim_id: req.params.id } })
        res.status(200).json({ message: "Success", idDeleted: req.params.id })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
  }
}

module.exports = kpim