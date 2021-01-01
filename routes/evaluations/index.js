const express = require('express');
const router = express.Router();
const evaluationController = require('../../controller/evaluationController');

// 평가 및 회고 - 평가 뷰
router.get('/', evaluationController.selectWeek);

// 평가 및 회고 - 키워드 별 task 뷰
router.get('/keywordTask', evaluationController.selectKeyword);

module.exports = router;