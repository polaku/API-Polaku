const router = require('express').Router()
const contactController = require('../controllers/contact')
const { authentication, authorizationContact } = require('../middleware/auth')
const { uploadSingle } = require('../middleware/multer')

router.use(authentication)

router.post('/', uploadSingle.single('doctor_letter'), contactController.create)
router.get('/', contactController.findAll)
router.get('/allContactUs', contactController.findAllContactUs)
router.get('/categories', contactController.findAllCategoris)
router.post('/discussion', contactController.createDiscussion)
router.get('/:id', contactController.findOne)
router.get('/discussion/:id', contactController.discussion)
router.put('/approved/:id', contactController.approved)
router.get('/rejected/:id', contactController.rejected)
router.get('/assigned/:id', contactController.assigned)
router.get('/taken/:id', contactController.taken)
router.get('/confirmation/:id', contactController.confirmation)
router.get('/done/:id', contactController.done)
router.put('/cancel/:id', contactController.cancel)

// router.use('/:id', authorizationContact)

router.delete('/:id', contactController.delete)
router.patch('/:id', contactController.update)

module.exports = router
