const { tbl_kpims, tbl_kpim_scores, tbl_account_details } = require('../models')

module.exports = async function inputNilaiKPIMTeam(userId, year, month, isAtasan) {
  let counterUserKPIM = 0, tempKPIM = [], tempScoreKPIM = 0, idAtasan

  if (isAtasan) {
    idAtasan = userId
  } else {
    let userDetail = await tbl_account_details.findOne({ where: { user_id: userId }, attributes: ['account_details_id', 'fullname', 'user_id', 'name_evaluator_1'] })

    idAtasan = userDetail && userDetail.name_evaluator_1 ? userDetail.name_evaluator_1 : null
  }

  if (idAtasan) {
    let bawahan = await tbl_account_details.findAll({ where: { name_evaluator_1: idAtasan }, attributes: ['account_details_id', 'fullname', 'user_id'] })
    let allKPIM = await tbl_kpims.findAll({ where: { year }, include: [{ model: tbl_kpim_scores, where: { month } }] })

    bawahan && await bawahan.forEach(async element => { //fetch kpim per user
      let newKPIM = []

      newKPIM = allKPIM.filter(el => el.user_id === element.user_id)
      tempKPIM = [...tempKPIM, ...newKPIM]
      if (newKPIM.length > 0) counterUserKPIM++

    });

    tempKPIM.forEach(kpimMonth => {
      tempScoreKPIM += +kpimMonth.tbl_kpim_scores[0].score_kpim_monthly * (Number(kpimMonth.tbl_kpim_scores[0].bobot) / 100)
    })

    let scoreKPIMTEAM = Math.ceil(tempScoreKPIM / counterUserKPIM)

    // console.log("score KPIM total", tempScoreKPIM)
    // console.log("counterUserKPIM", counterUserKPIM)
    // console.log("score KPIM TEAM", scoreKPIMTEAM)

    let kpimTEAMmonthselected = await tbl_kpims.findOne({ where: { indicator_kpim: 'KPIM TEAM', year, user_id: idAtasan }, include: [{ model: tbl_kpim_scores, where: { month } }] })

    kpimTEAMmonthselected && await tbl_kpim_scores.update({ score_kpim_monthly: scoreKPIMTEAM }, { where: { kpim_score_id: kpimTEAMmonthselected.tbl_kpim_scores[0].kpim_score_id } })

    return tempKPIM
  } else {
    return null
  }
}


