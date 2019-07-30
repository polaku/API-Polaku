const router = require('express').Router()
const bookingRoomController = require('../controllers/bookingRoom')

router.post('/', bookingRoomController.create)
router.get('/', bookingRoomController.findAll)
router.get('/:id', bookingRoomController.findOne)
router.delete('/:id', bookingRoomController.delete)
router.put('/:id', bookingRoomController.update)

module.exports = router
