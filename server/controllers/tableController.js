const Table = require('../models/Table');
const QRCode = require('qrcode');

// @desc Get all tables
// @route GET /api/tables
exports.getTables = async (req, res) => {
    try {
        const tables = await Table.find({});
        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Create a table and generate QR code
// @route POST /api/tables
exports.createTable = async (req, res) => {
    try {
        const { tableNumber } = req.body;
        
        const tableExists = await Table.findOne({ tableNumber });
        if (tableExists) {
            return res.status(400).json({ message: 'Table already exists' });
        }

        // Generate QR code data (URL for the customer menu)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const qrContent = `${frontendUrl}/table/${tableNumber}`;
        const qrCodeImage = await QRCode.toDataURL(qrContent);

        const table = new Table({
            tableNumber,
            qrCode: qrCodeImage
        });

        const createdTable = await table.save();
        res.status(201).json(createdTable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Delete a table
exports.deleteTable = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);
        if (table) {
            await table.deleteOne();
            res.json({ message: 'Table removed' });
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
