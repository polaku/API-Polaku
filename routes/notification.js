const router = require('express').Router()
const notificationController = require('../controllers/notification')
const { authentication } = require('../middleware/auth')

router.use(authentication)

router.get('/', notificationController.findAll)
router.put('/', notificationController.updateReadInline)
router.put('/:id', notificationController.updateRead)

module.exports = router
