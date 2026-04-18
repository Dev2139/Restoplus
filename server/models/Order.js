const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    tableNumber: { type: String, required: true },
    items: [{
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        quantity: { type: Number, required: true },
        notes: { type: String }
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Served', 'Cancelled'],
        default: 'Pending'
    },
    notes: { type: String },
    sessionId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
