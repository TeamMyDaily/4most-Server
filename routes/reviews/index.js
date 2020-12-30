const express = require('express');
const router = express.Router();
const reviewController = require('../../controller/reviewController.js')

router.get('/', reviewController.selectAll);
router.get('/weekReview', reviewController.selectWeek);
router.post('/weekReview', reviewController.addWeek);