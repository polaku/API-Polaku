const router = require('express').Router()
const companyController = require('../controllers/company')
const { authentication } = require('../middleware/auth')

router.use(authentication)

router.get('/', companyController.findAll)

module.exports = router
