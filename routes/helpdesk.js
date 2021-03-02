const router = require('express').Router()
const helpdeskController = require('../controllers/helpdesk')
const { uploadSingle } = require('../middleware/multer')
const { authentication } = require('../middleware/auth')

router.use(authentication)

router.post('/topics', uploadSingle.single('icon'), helpdeskController.createTopics)
router.get('/topics', helpdeskController.getAllTopics)
router.get('/topics/:id', helpdeskController.getOneTopics)
router.put('/topics/:id', uploadSingle.single('icon'), helpdeskController.updateTopics)
router.delete('/topics/:id', helpdeskController.deleteTopics)

router.get('/sub-topics/:id', helpdeskController.getOneTopics)
router.put('/sub-topics/:id/order', helpdeskController.updateOrderSubTopics)
router.put('/sub-topics/:id', helpdeskController.updateSubTopics)
router.delete('/sub-topics/:id', helpdeskController.deleteSubTopics)

router.post('/question', helpdeskController.createQuestion)
router.put('/question/like-unlike/:id', helpdeskController.likeUnlikeQuestion)
router.get('/question/like-unlike/:id', helpdeskController.getLikeUnlikeQuestion)
router.put('/question/:id/order', helpdeskController.updateOrderSubTopics)
router.put('/question/:id', helpdeskController.updateQuestion)
router.delete('/question/:id', helpdeskController.deleteQuestion)


// router.get('/', eventController.findAll)
// router.get('/all', eventController.findAllEvent)
// router.post('/follow', eventController.followEvent)
// router.get('/myevents', eventController.findAllByMe)
// router.put('/approvalEvent/:id', eventController.approvalEvent)

// router.post('/masterCreator', eventController.createMasterCreator)
// router.get('/masterCreator', eventController.findAllMasterCreator)
// router.delete('/masterCreator/:id', eventController.deleteMasterCreator)

// router.get('/:id', eventController.findOne)

// router.delete('/topics/:id', eventController.delete)
// router.delete('/sub-topics/:id', eventController.delete)


// router.put('/:id', uploadSingle.single('thumbnail'), eventController.update)

module.exports = router
