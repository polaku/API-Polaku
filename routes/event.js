const router = require('express').Router()
const eventController = require('../controllers/event')
const { uploadSingle } = require('../middleware/multer')
const { authentication, authorizationEvent } = require('../middleware/auth')

router.use(authentication)

router.post('/', uploadSingle.single('thumbnail'), eventController.create)
router.get('/', eventController.findAll)
router.get('/all', eventController.findAllEvent)
router.post('/follow', eventController.followEvent)
router.get('/myevents', eventController.findAllByMe)
router.put('/approvalEvent/:id', eventController.approvalEvent)

router.post('/masterCreator', eventController.createMasterCreator)
router.get('/masterCreator', eventController.findAllMasterCreator)
router.delete('/masterCreator/:id', eventController.deleteMasterCreator)

router.get('/:id', eventController.findOne)

// router.use('/:id',authorizationEvent)

router.delete('/:id', eventController.delete)
router.put('/:id', uploadSingle.single('thumbnail'), eventController.update)

module.exports = router
