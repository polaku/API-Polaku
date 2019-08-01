const router = require('express').Router()
const userController = require('../controllers/user')
const { authentication } = require('../middleware/auth')

router.post('/signup', userController.signup)
router.post('/signin', userController.signin)

router.use(authentication)

router.get('/', userController.findAll)
router.put('/changePassword', userController.changePassword)

module.exports = router
