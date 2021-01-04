const express = require('express');
const router = express.Router();
const taskController = require('../../controller/taskController');

router.get('/', taskController.readAll);

module.exports = router;