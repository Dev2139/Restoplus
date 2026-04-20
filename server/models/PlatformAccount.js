const mongoose = require('mongoose');

const platformAccountSchema = new mongoose.Schema({
    platform: {
        type: String,
        enum: ['Swiggy', 'Zomato'],
        required: true,
        unique: true
    },
    apiKey: { type: String },
    apiSecret: { type: String },
    merchantId: { type: String },
    isActive: { type: Boolean, default: false },
    lastSync: { type: Date },
    commissionRate: { type: Number, default: 20 }, // Default commission percentage
}, { timestamps: true });

module.exports = mongoose.model('PlatformAccount', platformAccountSchema);
