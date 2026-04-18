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

        // Check for existing active order for this table (excluding served/cancelled/completed)
        let order = await Order.findOne({ 
            tableNumber, 
            status: { $nin: ['Served', 'Cancelled', 'Completed'] } 
        });

        if (order) {
            // MERGE: Add items to existing order
            order.items.push(...items);
            order.totalAmount += totalAmount;
            if (notes) order.notes = order.notes ? `${order.notes} | New: ${notes}` : notes;
            
            await order.save();
            const populatedOrder = await Order.findById(order._id).populate('items.menuItem');
            
            // Notify kitchen of update
            const io = socketHandler.getIO();
            io.to('admin_kitchen').emit('order_updated', populatedOrder);
            io.to(`table_${tableNumber}`).emit('status_update', populatedOrder);

            return res.status(200).json(populatedOrder);
        }

        // NEW ORDER: Create if none active
        order = new Order({
            tableNumber,
            items,
            totalAmount,
            notes
        });

        const createdOrder = await order.save();
        
        // Populate items.menuItem before emitting to socket
        const populatedOrder = await Order.findById(createdOrder._id).populate('items.menuItem');
        
        // Notify kitchen/admin
        const io = socketHandler.getIO();
        io.to('admin_kitchen').emit('new_order', populatedOrder);

        res.status(201).json(populatedOrder);
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
            await order.save(); // CRITICAL: Save the change to DB

            // Populate before returning and emitting to ensure dish names are sent
            const updatedOrder = await Order.findById(order._id).populate('items.menuItem');

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

// @desc Get all active orders for a specific table (Session Total)
// @route GET /api/orders/table/:tableNumber/active
exports.getActiveOrdersByTable = async (req, res) => {
    try {
        const { tableNumber } = req.params;
        const orders = await Order.find({ 
            tableNumber, 
            status: { $nin: ['Cancelled'] } // Include Served orders for the final bill
        }).populate('items.menuItem');
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Finalize session for a table
// @route PUT /api/orders/table/:tableNumber/complete
exports.completeTableSession = async (req, res) => {
    try {
        const { tableNumber } = req.params;
        await Order.updateMany(
            { tableNumber, status: { $ne: 'Cancelled' } },
            { status: 'Completed' }
        );
        
        // Notify tracking pages that the session is done
        const io = socketHandler.getIO();
        io.to(`table_${tableNumber}`).emit('session_completed');
        
        res.json({ message: 'Session completed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
