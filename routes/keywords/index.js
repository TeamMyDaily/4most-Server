const express = require('express');
const router = express.Router();
const keywordController = require('../../controller/keywordController');

// /* [GET] localhost:3000/keywords/ */
// router.get('/', keywordController.readAll);
/* [POST] localhost:3000/keywords/  */
router.post('/', keywordController.selectKeyword);
/* [PUT] localhost:3000/keywords/  */
// router.put('/', keywordController.addKeyword);
// /* [DELETE] localhost:3000/keywords/  */
// router.delete('/', keywordController.deleteKeyword);
/* [POST] localhost:3000/keywords/define */
router.get('/priority', keywordController.defineKeywords);

module.exports = router;