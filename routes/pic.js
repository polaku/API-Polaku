const router = require('express').Router();
const picController = require('../controllers/pic');
const { authentication } = require('../middleware/auth');

router.use(authentication)

router.post('/', picController.create)
router.get('/', picController.findAll)
router.put('/:id', picController.update)

module.exports = router