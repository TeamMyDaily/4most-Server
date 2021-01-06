const express = require('express');
const router = express.Router();
const goalController = require('../../controller/goalController');
const authUtil = require('../../middlewares/authUtil')

router.get('/', goalController.readAll);
router.put('/', goalController.addGoal);
router.post('/', goalController.updateGoal);
router.post('/:weekGoalId', goalController.changeGoal);
router.delete('/:weekGoalId', goalController.deleteGoal);


module.exports = router;