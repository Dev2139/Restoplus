import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { DollarSign, ShoppingBag, TrendingUp, Download, RefreshCw, Layers } from 'lucide-react';
import { exportToExcel } from '../../services/exportUtils';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('daily');
    const [syncing, setSyncing] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchAnalytics();
    }, [timeframe]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/analytics?timeframe=${timeframe}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setData(data);
        } catch (error) {
            console.error('Error fetching analytics', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            await api.post('/analytics/sync-platform', { platform: 'Swiggy' }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            await api.post('/analytics/sync-platform', { platform: 'Zomato' }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchAnalytics();
        } catch (error) {
            console.error('Sync failed', error);
        } finally {
            setSyncing(false);
        }
    };

    const handleExport = async () => {
        try {
            const { data: rawOrders } = await api.get('/orders', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            exportToExcel(rawOrders, `Restoplus_Report_${new Date().toISOString().split('T')[0]}`);
        } catch (error) {
            console.error('Export failed', error);
        }
    };

    if (loading && !data) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const stats = [
        { label: 'Gross Revenue', value: `₹${data?.totalRevenue || 0}`, icon: DollarSign, color: 'text-green-500' },
        { label: 'Net Revenue', value: `₹${data?.netRevenue || 0}`, icon: TrendingUp, color: 'text-primary' },
        { label: 'Total Orders', value: data?.totalOrders || 0, icon: ShoppingBag, color: 'text-blue-500' },
        { label: 'Platforms', value: '3 Active', icon: Layers, color: 'text-purple-500' },
    ];

    const pieData = [
        { name: 'Local', value: data?.platformBreakdown?.Local?.revenue || 0, color: '#facc15' },
        { name: 'Swiggy', value: data?.platformBreakdown?.Swiggy?.revenue || 0, color: '#ff6b00' },
        { name: 'Zomato', value: data?.platformBreakdown?.Zomato?.revenue || 0, color: '#e03e52' },
    ].filter(item => item.value > 0);

    return (
        <div className="min-h-screen bg-black">
            <Header isAdmin={true} />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-grow p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Business <span className="text-primary not-italic">Analytics</span></h1>
                            <p className="text-gray-500 font-bold">Track Swiggy, Zomato & Table orders</p>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-gray-900 p-1.5 rounded-2xl border border-gray-800">
                            {['daily', 'monthly', 'yearly'].map((tf) => (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                                        timeframe === tf ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={handleSync}
                                disabled={syncing}
                                className="btn-secondary flex items-center gap-2 group"
                            >
                                <RefreshCw size={18} className={syncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                                {syncing ? 'Syncing...' : 'Sync Platforms'}
                            </button>
                            <button onClick={handleExport} className="btn-primary flex items-center gap-2">
                                <Download size={18} /> Export Excel
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="card p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-black">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-2xl bg-gray-800 ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Daily Sales Chart */}
                        <div className="lg:col-span-2 card p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <TrendingUp className="text-primary" size={20} /> Revenue Trend
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data?.dailySales || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                        <XAxis dataKey="_id" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                                            itemStyle={{ color: '#facc15' }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke="#facc15" 
                                            strokeWidth={4} 
                                            dot={{ fill: '#facc15', r: 6 }} 
                                            activeDot={{ r: 8, stroke: '#000', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Platform Distribution */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Layers className="text-primary" size={20} /> Platform Mix
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Popular Items Chart */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <ShoppingBag className="text-primary" size={20} /> Popular Dishes
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.popularItems || []} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis 
                                            dataKey="name" 
                                            type="category" 
                                            stroke="#6b7280" 
                                            fontSize={10} 
                                            width={100}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip 
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                                        />
                                        <Bar dataKey="count" fill="#facc15" radius={[0, 4, 4, 0]}>
                                            {(data?.popularItems || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.15} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Online Orders (Quick View) */}
                        <div className="card p-6 overflow-hidden">
                            <h3 className="text-xl font-bold mb-6">Recent Online Payouts</h3>
                            <div className="space-y-4">
                                {pieData.map((plat) => (
                                    <div key={plat.name} className="flex items-center justify-between p-4 bg-gray-900 rounded-2xl border border-gray-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-black" style={{ backgroundColor: plat.color }}>
                                                {plat.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold">{plat.name} Payouts</p>
                                                <p className="text-xs text-gray-500">Net after commissions</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-white">₹{data?.platformBreakdown?.[plat.name]?.revenue || 0}</p>
                                            <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{data?.platformBreakdown?.[plat.name]?.count || 0} orders</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Analytics;
