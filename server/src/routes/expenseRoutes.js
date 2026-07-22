const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const expenseController = require('../controllers/expenseController');

router.use(auth);
router.route('/')
  .post(expenseController.addExpense)
  .get(expenseController.getAll);

router.get('/summary', expenseController.getSummary);

router.route('/:id')
  .get(expenseController.getOne)
  .put(expenseController.update)
  .delete(expenseController.remove);

module.exports = router;
