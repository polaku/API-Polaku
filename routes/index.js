const router = require('express').Router()

const announcement = require('../routes/announcement')
const news = require('../routes/news')

router.use('/announcement', announcement)
router.use('/news', news)

module.exports = router
