const router = require('express').Router()
const eventController = require('../controllers/event')
const { upload } = require('../middleware/multer')

router.post('/', upload.single('thumbnail'), eventController.create)
router.get('/', eventController.findAll)
router.get('/:id', eventController.findOne)
router.delete('/:id', eventController.delete)
router.put('/:id', upload.single('thumbnail'), eventController.update)

module.exports = router
