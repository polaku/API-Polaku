const router = require('express').Router()
const securityController = require("../controllers/security")
const { authentication } = require("../middleware/auth")

router.use(authentication)
router.get('/login', securityController.findAllLogin)

module.exports = router
