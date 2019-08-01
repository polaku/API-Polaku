const router = require('express').Router()
const newsController = require('../controllers/news')
const { upload } = require('../middleware/multer')
const { authentication, authorizationNews } = require('../middleware/auth')

router.use(authentication)

router.post('/', upload.single('attachments'), newsController.create)
router.get('/', newsController.findAll)
router.get('/:id', newsController.findOne)

router.use('/:id', authorizationNews)

router.delete('/:id', newsController.delete)
router.put('/:id', upload.single('attachments'), newsController.update)

module.exports = router
