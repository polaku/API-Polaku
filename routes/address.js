const router = require('express').Router();
const addressController = require('../controllers/address');
const { authentication } = require('../middleware/auth');
const { uploadAny } = require('../middleware/multer');

router.use(authentication)

router.post('/', uploadAny.any(), addressController.create)
router.get('/', addressController.findAll)
router.get('/log', addressController.findAllLog)
router.put('/:id', uploadAny.any(), addressController.update)
router.delete('/:id', addressController.delete)

module.exports = router