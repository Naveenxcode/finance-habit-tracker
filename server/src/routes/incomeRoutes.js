const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const incomeController = require('../controllers/incomeController');

router.use(auth);
router.route('/')
  .post(incomeController.addIncome)
  .get(incomeController.getAll);

router.get('/summary', incomeController.getSummary);

router.route('/:id')
  .get(incomeController.getOne)
  .put(incomeController.update)
  .delete(incomeController.remove);

module.exports = router;
