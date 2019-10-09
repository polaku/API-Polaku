const router = require('express').Router()
const userController = require('../controllers/user')
const { authentication } = require('../middleware/auth')

router.get('/', authentication, userController.findAll)
router.post('/signup', userController.signup)
router.post('/signin', userController.signin)
router.get('/checktoken', userController.checktoken)
router.put('/changePassword', authentication, userController.changePassword)
router.put('/activationAccount', authentication, userController.activationAccount)
router.put('/editProfil', authentication, userController.editProfil)
router.put('/changeAvatar', authentication, userController.editProfil)

router.get('/:id', userController.findOne)

module.exports = router
