const router = require('express').Router()
const announcementController = require('../controllers/announcement')
const { upload } = require('../middleware/multer')
const { authentication } = require('../middleware/auth')

router.use(authentication)

router.post('/', upload.single('attachment'), announcementController.create)
router.get('/', announcementController.findAll)
router.get('/:id', announcementController.findOne)
router.delete('/:id', announcementController.delete)
router.put('/:id', upload.single('attachment'), announcementController.update)

module.exports = router
