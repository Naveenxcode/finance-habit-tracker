const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const habitController = require('../controllers/habitController');

router.use(auth);
router.route('/')
  .post(habitController.createHabit)
  .get(habitController.getHabits);

router.get('/today', habitController.getTodayHabits);

router.route('/:id')
  .get(habitController.getHabitById)
  .put(habitController.updateHabit)
  .delete(habitController.deleteHabit);

router.post('/:id/complete', habitController.completeHabit);
router.get('/:id/history', habitController.getHabitHistory);

module.exports = router;
