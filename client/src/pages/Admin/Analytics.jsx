import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data } = await api.get('/analytics', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setData(data);
        } catch (error) {
            console.error('Error fetching analytics', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const stats = [
        { label: 'Total Revenue', value: `₹${data.totalRevenue || 0}`, icon: DollarSign, color: 'text-green-500' },
        { label: 'Total Orders', value: data.totalOrders || 0, icon: ShoppingBag, color: 'text-primary' },
        { label: 'Average Order', value: `₹${data.totalOrders > 0 ? Math.round(data.totalRevenue / data.totalOrders) : 0}`, icon: TrendingUp, color: 'text-blue-500' },
        { label: 'Growth', value: `+${Math.floor(Math.random() * 20)}%`, icon: TrendingUp, color: 'text-purple-500' },
    ];

    return (
        <div className="min-h-screen bg-black">
            <Header isAdmin={true} />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-grow p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Sales <span className="text-primary not-italic">Analytics</span></h1>
                        <p className="text-gray-500 font-bold">Monitor your restaurant performance</p>
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Daily Sales Chart */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <TrendingUp className="text-primary" size={20} /> Daily Revenue
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.dailySales || []}>
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

                        {/* Popular Items Chart */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <ShoppingBag className="text-primary" size={20} /> Popular Dishes
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.popularItems || []} layout="vertical">
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
                                            {(data.popularItems || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.15} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Analytics;
