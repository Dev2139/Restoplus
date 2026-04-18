const Order = require('../models/Order');
const socketHandler = require('../socket/socketHandler');

// @desc Create new order
// @route POST /api/orders
exports.createOrder = async (req, res) => {
    try {
        const { tableNumber, items, totalAmount, notes } = req.body;

        if (!items || items.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        }

        const order = new Order({
            tableNumber,
            items,
            totalAmount,
            notes
        });

        const createdOrder = await order.save();
        
        // Notify kitchen/admin
        const io = socketHandler.getIO();
        io.to('admin_kitchen').emit('new_order', createdOrder);

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Get all orders
// @route GET /api/orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).populate('items.menuItem');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get order by ID
// @route GET /api/orders/:id
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.menuItem');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update order status
// @route PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();

            // Notify specific table and admin room
            const io = socketHandler.getIO();
            io.to(`table_${order.tableNumber}`).emit('status_update', updatedOrder);
            io.to('admin_kitchen').emit('order_updated', updatedOrder);

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
