const express = require('express');
const router = express.Router();
const goalController = require('../../controller/goalController');
const authUtil = require('../../middlewares/authUtil')

router.get('/', goalController.readAll);
router.post('/', goalController.addGoal);
router.put('/:weekGoalId', goalController.changeGoal);
router.put('/completion/:weekGoalId', goalController.updateGoal);
router.delete('/:weekGoalId', goalController.deleteGoal);


module.exports = router;