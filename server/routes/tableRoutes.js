const express = require('express');
const router = express.Router();
const { getTables, createTable, deleteTable } = require('../controllers/tableController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getTables);
router.post('/', protect, admin, createTable);
router.delete('/:id', protect, admin, deleteTable);

module.exports = router;
