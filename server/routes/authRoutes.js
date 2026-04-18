const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', register); // For now, allow anyone to register for initial setup, usually protected by admin

module.exports = router;
