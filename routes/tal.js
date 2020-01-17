const router = require('express').Router()
const talController = require("../controllers/tal")
const { authentication } = require("../middleware/auth")

router.use(authentication)
router.post('/', talController.create)
router.get('/', talController.findAll)
// router.get('/:id', talController.findOne)
// router.put('/:id', talController.update)
// router.delete('/:id', talController.delete)

module.exports = router
