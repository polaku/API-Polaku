const router = require('express').Router()
const structureController = require("../controllers/structure")
const { authentication } = require("../middleware/auth")

router.use(authentication)
router.post('/', structureController.create)
router.get('/', structureController.findAll)
router.get('/log', structureController.findAllLog)
router.put('/:id', structureController.update)
router.delete('/:id', structureController.delete)

module.exports = router
