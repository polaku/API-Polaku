const router = require('express').Router()
const kpimController = require("../controllers/kpim")
const { authentication } = require("../middleware/auth")

router.use(authentication)
router.post('/', kpimController.create)
router.get('/', kpimController.findAll)
router.get('/send-grade-one-year', kpimController.sendGradeOneYear)
router.put('/sendGrade', kpimController.sendGrade)
router.put('/calculateKPIMTEAM', kpimController.calculateKPIMTEAM)
router.get('/:id', kpimController.findOne)
router.put('/:id', kpimController.update)
router.delete('/:id', kpimController.delete)

module.exports = router
