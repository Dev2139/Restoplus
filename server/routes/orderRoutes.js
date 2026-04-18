const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', createOrder);
router.get('/', protect, getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
