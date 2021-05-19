const {
  tbl_status_employee_dates,
  tbl_account_details,
  tbl_users
} = require('../models');
const schedule = require('node-schedule');

async function rescheduleCRON() {
  await handleScheduleAddLeave();
}

async function handleScheduleAddLeave() {
  let allUser = await tbl_account_details.findAll({
    attributes: ['account_details_id', 'user_id'],
    include: [
      {
        required: true,
        as: 'userId',
        model: tbl_users,
        where: { activated: 1 },
        attributes: ['user_id', 'activated']
      }
    ]
  })

  await allUser.forEach(async (user) => {
    await scheduleAddLeave(user.user_id)
  });
}

async function scheduleAddLeave(userId) {
  try {
    let previousStatus = await tbl_status_employee_dates.findOne({
      where: {
        user_id: userId,
      },
      order: [['id', 'DESC']],
      attributes: ['id', 'user_id', 'status', 'start_date']
    })

    if (previousStatus && (previousStatus.status === 'Tetap' || previousStatus.status === 'Kontrak')) {
      let date = new Date(new Date(previousStatus.start_date).setYear(new Date().getFullYear(previousStatus.start_date) + 1));

      if (date > new Date()) {
        schedule.scheduleJob(date, async function () {
          let statusCurrent = await tbl_status_employee_dates.findOne({
            where: {
              user_id: userId,
            },
            order: [['id', 'DESC']],
            attributes: ['id', 'user_id', 'status', 'start_date']
          })

          if (previousStatus.id === statusCurrent.id && '' + previousStatus.start_date === '' + statusCurrent.start_date) {
            let oldData = await tbl_account_details.findOne({
              where: { user_id: userId },
              attributes: ['account_details_id', 'user_id', 'leave']
            })

            await tbl_account_details.update({ leave: oldData.leave + 12 }, { where: { user_id: userId } })
            console.log("TAMBAH CUTI BERHASIL", userId)
          }
        });
      }
    }
  } catch (err) {
    console.log(`Schedule Add Leave ${userId} is Error`)
  }
}

module.exports = {
  rescheduleCRON,
  scheduleAddLeave
};