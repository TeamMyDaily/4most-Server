const express = require('express');
const router = express.Router();
const reviewController = require('../../controller/reviewController.js')

router.get('/', reviewController.readAll);
router.get('/weekReview', reviewController.readOneWeek);
router.post('/weekReview', reviewController.)