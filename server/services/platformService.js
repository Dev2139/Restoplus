const axios = require('axios');
const Order = require('../models/Order');
const PlatformAccount = require('../models/PlatformAccount');

/**
 * Service to handle external platform integrations (Swiggy, Zomato)
 * Note: Real API implementations would require official partner credentials.
 */
class PlatformService {
    /**
     * Sync orders and payments from a specific platform
     */
    async syncPlatformData(platformName) {
        try {
            const account = await PlatformAccount.findOne({ platform: platformName, isActive: true });
            if (!account) {
                console.log(`No active account found for ${platformName}`);
                return { success: false, message: `Account for ${platformName} is not configured.` };
            }

            // --- SIMULATED API CALL ---
            // In a real scenario, you would call Swiggy/Zomato Partner APIs here:
            // const response = await axios.get(`https://api.${platformName.toLowerCase()}.com/v1/orders`, {
            //     headers: { 'Authorization': `Bearer ${account.apiKey}` }
            // });
            
            // Mocking some records for the demo
            const mockExternalOrders = this._generateMockOrders(platformName, account.commissionRate);
            
            let newOrdersCount = 0;
            for (const mockOrder of mockExternalOrders) {
                const exists = await Order.findOne({ 'paymentDetails.externalId': mockOrder.externalId });
                if (!exists) {
                    const newOrder = new Order({
                        platform: platformName,
                        items: [], // In reality, we'd map their menu items
                        totalAmount: mockOrder.totalAmount,
                        tableNumber: 'ONLINE',
                        status: 'Served', // Assume already processed if historical sync
                        paymentDetails: {
                            method: 'Online',
                            status: 'Paid',
                            externalId: mockOrder.externalId,
                            commission: mockOrder.commission,
                            netAmount: mockOrder.netAmount
                        },
                        customerDetails: mockOrder.customer,
                        createdAt: mockOrder.date
                    });
                    await newOrder.save();
                    newOrdersCount++;
                }
            }

            account.lastSync = new Date();
            await account.save();

            return { success: true, count: newOrdersCount };
        } catch (error) {
            console.error(`Sync failed for ${platformName}:`, error);
            throw error;
        }
    }

    _generateMockOrders(platform, commissionRate) {
        const orders = [];
        const now = new Date();
        
        for (let i = 0; i < 5; i++) {
            const amount = Math.floor(Math.random() * 1000) + 200;
            const commission = (amount * commissionRate) / 100;
            const date = new Date();
            date.setDate(now.getDate() - Math.floor(Math.random() * 30)); // Last 30 days

            orders.push({
                externalId: `${platform.toUpperCase()}_${Date.now()}_${i}`,
                totalAmount: amount,
                commission: commission,
                netAmount: amount - commission,
                date: date,
                customer: {
                    name: `Online Customer ${i + 1}`,
                    phone: `98765${Math.floor(Math.random() * 100000)}`,
                    address: `Delivery Address ${i + 1}, Some City`
                }
            });
        }
        return orders;
    }
}

module.exports = new PlatformService();
