const router = require('express').Router()
const departmentController = require('../controllers/department')
const { authentication } = require('../middleware/auth')

router.use(authentication)

router.get('/', departmentController.findAll)

module.exports = router
