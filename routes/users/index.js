const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController');
const authUtil = require('../../middlewares/authUtil')

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
// router.post('/sendEmail', userController.sendEmail);

router.get('/', userController.readOne);
// router.get('/', authUtil.checkToken, userController.readOne);
module.exports = router;