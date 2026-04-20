const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @desc Get analytics data
// @route GET /api/analytics
exports.getAnalytics = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const orders = await Order.find({ status: { $ne: 'Cancelled' } }).populate('items.menuItem');
        
        let totalRevenue = 0;
        let popularItems = {};

        orders.forEach(order => {
            totalRevenue += order.totalAmount;
            order.items.forEach(item => {
                if (item.menuItem) {
                    const itemName = item.menuItem.name;
                    popularItems[itemName] = (popularItems[itemName] || 0) + item.quantity;
                }
            });
        });

        // Convert popularItems to array and sort
        const sortedPopularItems = Object.keys(popularItems).map(name => ({
            name,
            count: popularItems[name]
        })).sort((a, b) => b.count - a.count).slice(0, 5);

        // Daily sales (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const dailySales = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Cancelled' } } },
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
            totalOrders,
            totalRevenue,
            popularItems: sortedPopularItems,
            dailySales
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
