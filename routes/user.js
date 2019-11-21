const router = require('express').Router()
const userController = require('../controllers/user')
const { authentication } = require('../middleware/auth')
const { uploadSingle } = require('../middleware/multer')

router.get('/', authentication, userController.findAll)
router.post('/signup', userController.signup)
router.post('/signin', userController.signin)
router.put('/forgetPassword', userController.forgetPassword)
router.get('/checktoken', userController.checktoken)
router.put('/changePassword', authentication, userController.firstLogin)
router.put('/activationAccount', authentication, userController.activationAccount)
router.put('/editProfil', authentication, userController.editProfil)
router.put('/changeAvatar', authentication, uploadSingle.single('avatar'), userController.changeAvatar)

router.get('/:id', userController.findOne)

module.exports = router
