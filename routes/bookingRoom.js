const router = require('express').Router()
const bookingRoomController = require('../controllers/bookingRoom')
const { authentication, authorizationBookingRoom } = require('../middleware/auth')

router.use(authentication)

router.post('/', bookingRoomController.create)
router.get('/', bookingRoomController.findAllBookingRooms)
router.get('/myRoom', bookingRoomController.findAllMyBookingRooms)

//Room
router.get('/rooms', bookingRoomController.findAllRoom)
router.post('/rooms', bookingRoomController.createRoom)
router.delete('/rooms/:id', bookingRoomController.deleteRoom)
router.put('/rooms/:id', bookingRoomController.editRoom)

//Building
router.get('/building', bookingRoomController.findAllBuilding)
router.post('/building', bookingRoomController.createBuilding)
router.delete('/building/:id', bookingRoomController.deleteBuilding)
router.put('/building/:id', bookingRoomController.editBuilding)

//Room Master
router.post('/roomMaster', bookingRoomController.createRoomMaster)
router.get('/roomMaster', bookingRoomController.findAllRoomMaster)
router.delete('/roomMaster/:id', bookingRoomController.deleteRoomMaster)
router.put('/roomMaster/:id', bookingRoomController.editRoomMaster)

router.get('/:idRoom/:month', bookingRoomController.findAllRoomsInMonth)
router.get('/:idRoom/:month/myRoom', bookingRoomController.findAllMyRoomsInMonth)
router.get('/:id', bookingRoomController.findOne)

// router.use('/:id', authorizationBookingRoom)

router.delete('/:id', bookingRoomController.delete)
router.put('/:id', bookingRoomController.update)

module.exports = router
