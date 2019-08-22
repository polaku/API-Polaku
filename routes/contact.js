const router = require('express').Router()
const contactController = require('../controllers/contact')
const { authentication, authorizationContact } = require('../middleware/auth')

router.use(authentication)

router.post('/', contactController.create)
router.get('/', contactController.findAll)
router.get('/categories', contactController.findAllCategories)
router.get('/:id', contactController.findOne)
router.get('/assigned/:id', contactController.assigned)
router.get('/taken/:id/:taken_by', contactController.taken)
router.get('/confirmation/:id', contactController.confirmation)
router.get('/done/:id', contactController.done)
router.get('/cancel/:id', contactController.cancel)

router.use('/:id', authorizationContact)

router.delete('/:id', contactController.delete)
router.patch('/:id', contactController.update)

module.exports = router
