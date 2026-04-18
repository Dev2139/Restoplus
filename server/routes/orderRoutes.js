const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus, getActiveOrdersByTable, completeTableSession, updateItemStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', createOrder);
router.get('/', protect, getOrders);
router.get('/table/:tableNumber/active', getActiveOrdersByTable);
router.put('/table/:tableNumber/complete', completeTableSession);
router.get('/:id', getOrderById);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/items/:itemId/status', protect, updateItemStatus);

module.exports = router;
