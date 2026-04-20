const mongoose = require('mongoose');
const PlatformAccount = require('./models/PlatformAccount');
require('dotenv').config();

const seedPlatforms = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding platforms');

        const platforms = [
            {
                platform: 'Swiggy',
                apiKey: 'mock_swiggy_key',
                isActive: true,
                commissionRate: 20
            },
            {
                platform: 'Zomato',
                apiKey: 'mock_zomato_key',
                isActive: true,
                commissionRate: 22
            }
        ];

        for (const p of platforms) {
            await PlatformAccount.findOneAndUpdate(
                { platform: p.platform },
                p,
                { upsert: true, new: true }
            );
        }

        console.log('Platform accounts seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedPlatforms();
