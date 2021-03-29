const router = require('express').Router()
const onboardingController = require("../controllers/onboarding")
const { authentication } = require("../middleware/auth")

router.use(authentication)
router.get('/', onboardingController.findAll)

module.exports = router
