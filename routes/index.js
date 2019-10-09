const router = require('express').Router()

const announcement = require('../routes/announcement')
const news = require('../routes/news')
const bookingRoom = require('../routes/bookingRoom')
const event = require('../routes/event')
const user = require('../routes/user')
const contact = require('../routes/contact')
const company = require('../routes/company')
const department = require('../routes/department')
const notification = require('../routes/notification')

router.get('/', (req, res)=>{
    res.send('Welcome to server polaku')
})
router.use('/announcement', announcement)
router.use('/news', news)
router.use('/bookingRoom', bookingRoom)
router.use('/events', event)
router.use('/users', user)
router.use('/contactUs', contact)
router.use('/company', company)
router.use('/department', department)
router.use('/notification', notification)

module.exports = router
