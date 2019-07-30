const router = require('express').Router()
const roomBookingController = require('../controllers/roomBooking')

router.post('/', roomBookingController.create)
router.get('/', roomBookingController.findAll)
router.get('/:id', roomBookingController.findOne)
router.delete('/:id', roomBookingController.delete)
router.put('/:id', roomBookingController.update)

module.exports = router
