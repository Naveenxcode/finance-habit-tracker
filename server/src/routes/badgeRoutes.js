const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const badgeController = require('../controllers/badgeController');

router.get('/my', auth, badgeController.getMyBadges);

module.exports = router;
