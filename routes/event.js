const router = require('express').Router()
const eventController = require('../controllers/event')
const { uploadSingle } = require('../middleware/multer')
const { authentication, authorizationEvent } = require('../middleware/auth')

router.use(authentication)

router.post('/', uploadSingle.single('thumbnail'), eventController.create)
router.get('/', eventController.findAll)
router.post('/follow', eventController.followEvent)
router.get('/myevents', eventController.findAllByMe)
router.get('/:id', eventController.findOne)

router.use('/:id',authorizationEvent)
router.delete('/:id', eventController.delete)
router.put('/:id', uploadSingle.single('thumbnail'), eventController.update)

module.exports = router
