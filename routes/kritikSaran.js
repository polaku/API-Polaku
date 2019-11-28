const router = require('express').Router()
const kritikSaranController = require('../controllers/kritikSaran')
const { authentication } = require('../middleware/auth')

router.use(authentication)

router.get('/', kritikSaranController.findAll)
router.post('/', kritikSaranController.create)

module.exports = router
