const router = require('express').Router();
const dinasController = require('../controllers/dinas');
const { authentication } = require('../middleware/auth');

router.use(authentication)

router.post('/', dinasController.create)
router.get('/', dinasController.findAll)
router.get('/log', dinasController.findAllLog)
router.delete('/user/:userId', dinasController.deleteUser)
router.get('/:userId', dinasController.findOne)
router.put('/:id', dinasController.update)
router.delete('/:id', dinasController.delete)

module.exports = router