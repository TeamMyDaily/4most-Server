const express = require('express');
const router = express.Router();
const taskController = require('../../controller/taskController');

router.get('/', taskController.readAll);
router.get('/:taskId', taskController.readTask);
router.post('/', taskController.createTask);

module.exports = router;