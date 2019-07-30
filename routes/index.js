const router = require('express').Router()

const announcement = require('../routes/announcement')
const news = require('../routes/news')
const bookingRoom = require('../routes/bookingRoom')
const event = require('../routes/event')
const user = require('../routes/user')

router.use('/announcement', announcement)
router.use('/news', news)
router.use('/bookingRoom', bookingRoom)
router.use('/events', event)
router.use('/users', user)

module.exports = router
