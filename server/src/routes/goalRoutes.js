const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const goalController = require('../controllers/goalController');

router.use(auth);
router.route('/')
  .post(goalController.createGoal)
  .get(goalController.getGoals);

router.route('/:id')
  .get(goalController.getGoalById)
  .put(goalController.updateGoal)
  .delete(goalController.deleteGoal);

router.post('/:id/contribute', goalController.contributeToGoal);
router.get('/:id/contributions', goalController.getGoalContributions);

module.exports = router;
