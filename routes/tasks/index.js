const express = require('express');
const router = express.Router();
const taskController = require('../../controller/taskController');

router.get('/', taskController.readAll);
router.post('/', taskController.createTask);
router.get('/:taskId', taskController.readTask);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;