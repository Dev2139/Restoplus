const express = require('express');
const router = express.Router();
const { getAnalytics, getPlatforms, updatePlatform, syncPlatform } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getAnalytics);
router.post('/sync-platform', protect, admin, syncPlatform);
router.get('/platforms', protect, admin, getPlatforms);
router.put('/platforms/:id', protect, admin, updatePlatform);

module.exports = router;
