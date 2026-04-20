const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for migration');

        // Update all orders that don't have a platform field
        const result = await Order.updateMany(
            { platform: { $exists: false } },
            { 
                $set: { 
                    platform: 'Local',
                    'paymentDetails.method': 'Cash', // Default for old orders
                    'paymentDetails.status': 'Paid',
                    'paymentDetails.commission': 0
                } 
            }
        );

        console.log(`Migration complete. Updated ${result.modifiedCount} orders.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
