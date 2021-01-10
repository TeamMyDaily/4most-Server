const express = require('express');
const router = express.Router();
const reviewController = require('../../controller/reviewController.js')

router.get('/', reviewController.readOne);
router.post('/', reviewController.createOrUpdateOne);

module.exports = router;