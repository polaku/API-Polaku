const router = require('express').Router()
const contactController = require('../controllers/contact')
const { authentication, authorizationContact } = require('../middleware/auth')

router.use(authentication)

router.post('/', contactController.create)
router.get('/', contactController.findAll)
router.get('/:id', contactController.findOne)

router.use('/:id', authorizationContact)

router.delete('/:id', contactController.delete)
router.patch('/:id', contactController.update)

module.exports = router
