const express = require('express');
const router = express.Router();
const evaluationController = require('../../controller/evaluationController');

router.get('/', evaluationController.selectWeek);