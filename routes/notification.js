const router = require('express').Router()
const notificationController = require('../controllers/notification')
const { authentication } = require('../middleware/auth')
const { uploadSingle } = require('../middleware/multer')

router.use(authentication)

router.post('/', notificationController.create)
router.get('/', notificationController.findAll)
router.put('/', notificationController.updateReadInline)
router.put('/category/:id', uploadSingle.single('icon'), notificationController.editCategory)
router.delete('/category/:id', notificationController.deleteCategory)
router.post('/category', uploadSingle.single('icon'), notificationController.createCategory)
router.get('/category', notificationController.findAllCategory)
router.put('/:id', notificationController.updateRead)

module.exports = router
