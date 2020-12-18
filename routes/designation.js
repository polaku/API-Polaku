const router = require('express').Router()
const designationController = require("../controllers/designation")
const { authentication } = require("../middleware/auth")

router.use(authentication)
router.post('/', designationController.create)
router.get('/', designationController.findAll)
router.get('/log', designationController.findAllLog)
router.delete('/user/:id', designationController.deleteUser)
router.delete('/:id', designationController.delete)

module.exports = router
