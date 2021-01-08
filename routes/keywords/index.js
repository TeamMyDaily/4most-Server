const express = require('express');
const router = express.Router();
const keywordController = require('../../controller/keywordController');

/* [POST] localhost:3000/keywords/  */
router.post('/', keywordController.selectKeywords);
/* [POST] localhost:3000/keywords/definition */
router.post('/definition', keywordController.defineKeywords);
/* [POST] localhost:3000/keywords/priority */
router.post('/priority', keywordController.setPriorities);
/* [PUT] localhost:3000/keywords */
router.post ('/new', keywordController.addKeyword);
/* [DELETE] localhost:3000/keywords */
router.delete('/', keywordController.deleteKeyword);

module.exports = router;