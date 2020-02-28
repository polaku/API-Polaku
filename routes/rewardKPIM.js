const router = require('express').Router()
const rewardKPIMController = require("../controllers/rewardKPIM")
const { authentication } = require("../middleware/auth")

router.use(authentication)
router.post('/', rewardKPIMController.create)
router.get('/', rewardKPIMController.findAll)
// router.get('/:id', talController.findOne)
// router.put('/:id', talController.update)
// router.delete('/:id', talController.delete)

module.exports = router
