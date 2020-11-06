const router = require('express').Router()
const designationController = require("../controllers/designation")
const { authentication } = require("../middleware/auth")

router.use(authentication)
router.post('/', designationController.create)
router.get('/', designationController.findAll)
// router.get('/:id', designationController.findOne)
// router.put('/:id', designationController.update)
router.delete('/user/:userId', designationController.deleteUser)
router.delete('/:id', designationController.delete)

module.exports = router
