const router = require('express').Router();
const buildingController = require('../controllers/building');

router.get('/', buildingController.findAll)

module.exports = router