const router = require('express').Router()
const newsController = require('../controllers/news')
const { uploadAny } = require('../middleware/multer')
const { authentication, authorizationNews } = require('../middleware/auth')

router.use(authentication)

router.post('/', uploadAny.any(), newsController.create)
router.get('/', newsController.findAll)
router.get('/:id', newsController.findOne)

router.use('/:id', authorizationNews)

router.delete('/:id', newsController.delete)
router.put('/:id', uploadAny.any(), newsController.update)

module.exports = router
