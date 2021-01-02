const express = require('express');
const router = express.Router();
const reportController = require('../../controller/reportController');

// 평가 및 회고 - 평가 뷰
router.get('/', reportController.selectWeek);

// 평가 및 회고 - 키워드 별 task 뷰
router.get('/keywordTask', reportController.selectKeyword);

module.exports = router;