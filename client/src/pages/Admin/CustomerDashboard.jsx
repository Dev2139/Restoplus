import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Users, Search } from 'lucide-react';

const CustomerDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchOrdersAndAggregate();
    }, []);

    const fetchOrdersAndAggregate = async () => {
        try {
            const { data } = await api.get('/orders', {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            // Aggregate orders by customer (Name + Phone)
            const customerMap = {};

            data.forEach(order => {
                if (order.customerName && order.customerPhone) {
                    const key = order.customerPhone;
                    if (!customerMap[key]) {
                        customerMap[key] = {
                            name: order.customerName,
                            phone: order.customerPhone,
                            totalOrders: 0,
                            totalSpent: 0,
                            lastVisited: order.createdAt
                        };
                    }
                    
                    customerMap[key].totalOrders += 1;
                    const grandTotal = Math.round(order.totalAmount * 1.05);
                    customerMap[key].totalSpent += grandTotal;
                    
                    if (new Date(order.createdAt) > new Date(customerMap[key].lastVisited)) {
                        customerMap[key].lastVisited = order.createdAt;
                    }
                }
            });

            const aggregatedData = Object.values(customerMap);
            setCustomers(aggregatedData);
            setFilteredCustomers(aggregatedData);
        } catch (error) {
            console.error('Error fetching customer data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!search) {
            setFilteredCustomers(customers);
        } else {
            const query = search.toLowerCase();
            setFilteredCustomers(
                customers.filter(c => 
                    c.name.toLowerCase().includes(query) || 
                    c.phone.toLowerCase().includes(query)
                )
            );
        }
    }, [search, customers]);

    return (
        <div className="min-h-screen bg-black text-white">
            <Header isAdmin={true} />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-grow p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Customer <span className="text-primary not-italic">Dashboard</span></h1>
                            <p className="text-gray-500 font-bold">View and search registered diner profiles</p>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search by name or mobile..."
                                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-primary text-sm text-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="card p-12 text-center space-y-4">
                            <Users className="w-12 h-12 text-gray-600 mx-auto" />
                            <h3 className="text-lg font-bold text-gray-400">No Customers Found</h3>
                            <p className="text-gray-600 text-sm max-w-xs mx-auto">Once customers enter their details at the tables, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-gray-900/50 border border-gray-800 rounded-2xl shadow-xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-800 bg-black/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                                        <th className="p-4">Customer Name</th>
                                        <th className="p-4">Mobile Number</th>
                                        <th className="p-4 text-center">Orders</th>
                                        <th className="p-4 text-right">Total Spent (inc. GST)</th>
                                        <th className="p-4 text-right">Last Order</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50 text-sm">
                                    {filteredCustomers.map((customer, i) => (
                                        <tr key={i} className="hover:bg-gray-800/20 transition-colors">
                                            <td className="p-4 font-bold text-white flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs uppercase">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                {customer.name}
                                            </td>
                                            <td className="p-4 text-gray-300 font-mono">{customer.phone}</td>
                                            <td className="p-4 text-center">
                                                <span className="bg-gray-800 text-gray-300 font-bold text-xs px-2 py-1 rounded-lg">
                                                    {customer.totalOrders}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-bold text-primary">
                                                ₹{customer.totalSpent}
                                            </td>
                                            <td className="p-4 text-right text-gray-400 text-xs">
                                                {new Date(customer.lastVisited).toLocaleDateString()} {new Date(customer.lastVisited).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CustomerDashboard;
