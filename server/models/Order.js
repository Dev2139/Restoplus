const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    tableNumber: { type: String, required: true },
    items: [{
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        quantity: { type: Number, required: true },
        notes: { type: String },
        status: {
            type: String,
            enum: ['Pending', 'Served'],
            default: 'Pending'
        }
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Served', 'Cancelled'],
        default: 'Pending'
    },
    notes: { type: String },
    sessionId: { type: String },
    platform: {
        type: String,
        enum: ['Local', 'Swiggy', 'Zomato'],
        default: 'Local'
    },
    paymentDetails: {
        method: { type: String, enum: ['Cash', 'UPI', 'Card', 'Online'], default: 'Cash' },
        status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
        externalId: { type: String }, // Transaction ID or Platform Order ID
        commission: { type: Number, default: 0 },
        netAmount: { type: Number }
    },
    deliveryDetails: {
        status: { type: String, enum: ['Pending', 'Assigned', 'Dispatched', 'Delivered', 'Cancelled'], default: 'Pending' },
        riderName: { type: String },
        riderPhone: { type: String },
        trackingUrl: { type: String }
    },
    customerDetails: {
        name: { type: String },
        phone: { type: String },
        address: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
