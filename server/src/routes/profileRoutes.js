const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.use(auth);
router.put('/', authController.updateProfile);
router.put('/onboarding', authController.completeOnboarding);
router.put('/settings', authController.updateSettings);
router.put('/password', authController.changePassword);

module.exports = router;
