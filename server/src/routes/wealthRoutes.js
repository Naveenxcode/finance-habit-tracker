const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const wealthController = require('../controllers/wealthController');

router.use(auth);
router.get('/summary', wealthController.getNetWorthSummary);
router.get('/snapshots', wealthController.getSnapshots);

router.route('/assets')
  .post(wealthController.addAsset)
  .get(wealthController.getAssets);

router.route('/assets/:id')
  .put(wealthController.updateAsset)
  .delete(wealthController.deleteAsset);

router.route('/liabilities')
  .post(wealthController.addLiability)
  .get(wealthController.getLiabilities);

router.route('/liabilities/:id')
  .put(wealthController.updateLiability)
  .delete(wealthController.deleteLiability);

module.exports = router;
