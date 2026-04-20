const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const PlatformService = require('../services/platformService');
const PlatformAccount = require('../models/PlatformAccount');

// @desc Get analytics data
// @route GET /api/analytics
exports.getAnalytics = async (req, res) => {
    try {
        const { timeframe } = req.query; // 'daily', 'monthly', 'yearly'
        
        let dateFilter = {};
        const now = new Date();
        
        if (timeframe === 'monthly') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            dateFilter = { createdAt: { $gte: startOfMonth } };
        } else if (timeframe === 'yearly') {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            dateFilter = { createdAt: { $gte: startOfYear } };
        } else {
            // Default: Last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
        }

        const orders = await Order.find({ 
            ...dateFilter,
            status: { $ne: 'Cancelled' } 
        }).populate('items.menuItem');
        
        let totalRevenue = 0;
        let netRevenue = 0;
        let platformBreakdown = {
            Local: { revenue: 0, count: 0 },
            Swiggy: { revenue: 0, count: 0 },
            Zomato: { revenue: 0, count: 0 }
        };
        let popularItems = {};

        orders.forEach(order => {
            const platform = order.platform || 'Local';
            totalRevenue += order.totalAmount;
            
            // Net revenue = Total - Commision
            const commission = order.paymentDetails?.commission || 0;
            netRevenue += (order.totalAmount - commission);

            if (platformBreakdown[platform]) {
                platformBreakdown[platform].revenue += order.totalAmount;
                platformBreakdown[platform].count += 1;
            }

            order.items.forEach(item => {
                if (item.menuItem) {
                    const itemName = item.menuItem.name;
                    popularItems[itemName] = (popularItems[itemName] || 0) + item.quantity;
                }
            });
        });

        const sortedPopularItems = Object.keys(popularItems).map(name => ({
            name,
            count: popularItems[name]
        })).sort((a, b) => b.count - a.count).slice(0, 5);

        // Group by Date for Chart
        const dailySales = await Order.aggregate([
            { $match: { ...dateFilter, status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            totalOrders: orders.length,
            totalRevenue,
            netRevenue,
            platformBreakdown,
            popularItems: sortedPopularItems,
            dailySales
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Sync data from external platforms
// @route POST /api/analytics/sync-platform
exports.syncPlatform = async (req, res) => {
    try {
        const { platform } = req.body;
        const result = await PlatformService.syncPlatformData(platform);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all platform accounts
// @route GET /api/analytics/platforms
exports.getPlatforms = async (req, res) => {
    try {
        const platforms = await PlatformAccount.find();
        res.json(platforms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update platform settings
// @route PUT /api/analytics/platforms/:id
exports.updatePlatform = async (req, res) => {
    try {
        const platform = await PlatformAccount.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(platform);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
