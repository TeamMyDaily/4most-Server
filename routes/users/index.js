const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController');
const authUtil = require('../../middlewares/authUtil')

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
// router.post('/sendEmail', userController.sendEmail);

router.delete('/', authUtil.checkToken, userController.deleteOne);
router.post('/password', authUtil.checkToken, userController.readPassword);
router.post('/newPassword', authUtil.checkToken, userController.updatePassword);
router.post('/nickname', authUtil.checkToken, userController.updateNickname);
module.exports = router;