const router = require('express').Router()

const announcement = require('../routes/announcement')
const news = require('../routes/news')
const bookingRoom = require('../routes/bookingRoom')

router.use('/announcement', announcement)
router.use('/news', news)
router.use('/bookingRoom', bookingRoom)

module.exports = router
