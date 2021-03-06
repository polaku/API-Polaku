const router = require('express').Router()
const userController = require('../controllers/user')
const { authentication } = require('../middleware/auth')
const { uploadSingle } = require('../middleware/multer')

router.get('/', authentication, userController.findAll)
router.post('/signup', uploadSingle.single('avatar'), userController.signup)
router.get('/signout', userController.signout)
router.post('/register', authentication, uploadSingle.single('avatar'), userController.register)
router.post('/signin', userController.signin)
router.put('/forgetPassword', userController.forgetPassword)
router.get('/check-token', userController.checktoken)
router.get('/for-option', authentication, userController.forOption)
router.put('/changePassword', authentication, userController.firstLogin)
router.put('/activationAccount', authentication, userController.activationAccount)
router.put('/editProfil', authentication, userController.editProfil) //authorization
router.put('/editUser/:id', authentication, userController.editUser)
router.put('/changeAvatar', authentication, uploadSingle.single('avatar'), userController.changeAvatar)
router.post('/importUser', authentication, uploadSingle.single('file'), userController.importUser)
router.post('/settingImportUser', authentication, uploadSingle.single('file'), userController.settingImportUser)
router.get('/normalitationNIK', authentication, userController.normalitationNIK)
router.get('/log', authentication, userController.findAllLog)
router.put('/reset-password/:token', userController.resetPassword);
router.get('/forget-password', userController.forgetPassword);

router.put('/:id', authentication, uploadSingle.single('avatar'), userController.update)
router.get('/:id', userController.findOne)

module.exports = router
