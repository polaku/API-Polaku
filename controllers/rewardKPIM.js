const { tbl_reward_kpims } = require("../models")
const logError = require('../helpers/logError')

class rewardKPIM {
  static create(req, res) {
    let newData = {
      nilai_bawah: req.body.nilai_bawah,
      nilai_atas: req.body.nilai_atas,
      reward: req.body.reward,
      user_id: req.body.user_id
    }

    tbl_reward_kpims.create(newData)
      .then(data => {
        // res.setHeader('Cache-Control', 'no-cache');
        res.status(201).json({ message: "Success", data })
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static async findAll(req, res) {
    try {
      if (req.query) {
        if (req.query.all === "true") {
          let getAllReward = await tbl_reward_kpims.findAll()

          // res.setHeader('Cache-Control', 'no-cache');
          res.status(200).json({ message: "Success", totalRecord: getAllReward.length, data: getAllReward })
        }
      } else {
        let getAllReward = await tbl_reward_kpims.findAll({ where: { user_id: req.user.user_id } })

        // res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json({ message: "Success", totalRecord: getAllReward.length, data: getAllReward })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }
}

module.exports = rewardKPIM