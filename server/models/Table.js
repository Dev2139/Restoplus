const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber: { type: String, required: true, unique: true },
    qrCode: { type: String }, // Base64 or URL
    currentSessionId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
