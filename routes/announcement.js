const router = require('express').Router()
const announcementController = require('../controllers/announcement')
const { uploadAny } = require('../middleware/multer')
const { authentication, authorizationAnnouncement } = require('../middleware/auth')

router.use(authentication)

router.post('/', uploadAny.any(), announcementController.create)
router.get('/', announcementController.findAll)
router.get('/:id', announcementController.findOne)

// router.use('/:id', authorizationAnnouncement)

router.delete('/:id', announcementController.delete)
router.put('/:id', uploadAny.any(), announcementController.update)

module.exports = router
