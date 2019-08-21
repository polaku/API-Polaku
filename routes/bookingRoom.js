const router = require('express').Router()
const bookingRoomController = require('../controllers/bookingRoom')
const { authentication, authorizationBookingRoom } = require('../middleware/auth')

router.use(authentication)

router.post('/', bookingRoomController.create)
router.get('/', bookingRoomController.findAllBookingRooms)
router.get('/rooms', bookingRoomController.findAllRooms)
router.get('/listRoom', bookingRoomController.findListRoom)
router.get('/:idRoom/:month', bookingRoomController.findAllRoomsInMonth)
router.get('/:idRoom/:month/myRoom', bookingRoomController.findAllMyRoomsInMonth)
router.get('/:id', bookingRoomController.findOne)

router.use('/:id', authorizationBookingRoom)

router.delete('/:id', bookingRoomController.delete)
router.put('/:id', bookingRoomController.update)

module.exports = router
