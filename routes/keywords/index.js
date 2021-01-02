const express = require('express');
const router = express.Router();
const keywordController = require('../../controller/keywordController');

/* [GET] localhost:3000/keywords/ */
router.get('/', keywordController.readAll);
/* [POST] localhost:3000/keywords/  */
router.post('/', keywordController.selectKeyword);
/* [PUT] localhost:3000/keywords/  */
router.put('/', keywordController.addKeyword);
/* [DELETE] localhost:3000/keywords/  */
router.delete('/', keywordController.deleteKeyword);
/* [GET] localhost:3000/keywords/:priority */
router.get('/:priority', keywordController.addPriority);

module.exports = router;