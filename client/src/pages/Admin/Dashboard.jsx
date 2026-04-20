import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { Clock, Table, CheckCircle, ChevronRight, AlertCircle, Play, Check, Utensils } from 'lucide-react';
import { UPLOAD_URL } from '../../services/api';
import Button from '../../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { socket, joinAdmin } = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        fetchOrders();
        joinAdmin();

        if (socket) {
            socket.on('new_order', (newOrder) => {
                setOrders(prev => [newOrder, ...prev]);
                // Play notification sound if possible
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
                audio.play().catch(e => console.log('Audio play failed'));
            });

            socket.on('order_updated', (updatedOrder) => {
                setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
                // Play notification sound on update too (important for merged items)
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
                audio.play().catch(e => console.log('Audio play failed'));
            });
        }

        return () => {
            if (socket) {
                socket.off('new_order');
                socket.off('order_updated');
            }
        };
    }, [socket]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    const updateItemStatus = async (orderId, itemId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/items/${itemId}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
        } catch (error) {
            console.error('Error updating item status', error);
        }
    };

    const handleServeAllItems = async (orderId) => {
        try {
            await api.put(`/orders/${orderId}/serve-all`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
        } catch (error) {
            console.error('Error serving all items', error);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Accepted': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Preparing': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'Ready': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Served': return 'bg-primary/10 text-primary border-primary/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <Header isAdmin={true} />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-grow p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Kitchen <span className="text-primary not-italic">Dashboard</span></h1>
                            <p className="text-gray-500 font-bold">Manage incoming orders in real-time</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 flex items-center gap-2">
                                <AlertCircle size={18} className="text-primary animate-pulse" />
                                <span className="text-sm font-bold">{orders.filter(o => o.status === 'Pending').length} Pending Orders</span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="card h-64 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {orders.map((order) => (
                                    <motion.div
                                        key={order._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`card flex flex-col ${order.status === 'Pending' ? 'border-primary/50 shadow-[0_0_20px_rgba(250,204,21,0.1)]' : ''}`}
                                    >
                                        <div className="p-4 border-b border-gray-800 flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="bg-primary text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">Table {order.tableNumber}</span>
                                                    <span className="text-gray-500 text-xs font-bold">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-black text-lg">Order #{order._id.slice(-6).toUpperCase()}</h3>
                                                    {order.items.some(i => i.status === 'Pending') && (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleServeAllItems(order._id);
                                                            }}
                                                            className="bg-primary/10 hover:bg-primary text-primary hover:text-black text-[8px] font-black px-2 py-1 rounded border border-primary/20 transition-all flex items-center gap-1"
                                                        >
                                                            <Check size={10} /> SERVE ALL NEW
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyles(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="p-4 flex-grow space-y-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center gap-4 bg-gray-900/40 p-2 rounded-xl border border-gray-800/50">
                                                    <div className="flex gap-3 items-center">
                                                        {item.menuItem?.image ? (
                                                            <img 
                                                                src={`${UPLOAD_URL}${item.menuItem.image}`} 
                                                                alt={item.menuItem.name} 
                                                                className="w-10 h-10 object-cover rounded-lg border border-gray-700"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                                                                <Utensils size={14} className="text-gray-500" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-bold text-sm leading-tight text-white flex items-center gap-1">
                                                                    <span className="text-primary mr-1">x{item.quantity}</span>
                                                                    {item.menuItem?.name || 'Unknown Item'}
                                                                </p>
                                                                {item.status === 'Pending' ? (
                                                                    <span className="bg-red-500/20 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-red-500/30 animate-pulse">NEW</span>
                                                                ) : (
                                                                    <span className="bg-green-500/20 text-green-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-green-500/30">DONE</span>
                                                                )}
                                                            </div>
                                                            {item.notes && <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 italic"><AlertCircle size={10} /> {item.notes}</p>}
                                                        </div>
                                                    </div>

                                                    {item.status === 'Pending' && order.status !== 'Served' && (
                                                        <button 
                                                            onClick={() => updateItemStatus(order._id, item._id, 'Served')}
                                                            className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-black rounded-lg transition-all border border-primary/20"
                                                            title="Mark Item as Served"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            
                                            {order.notes && (
                                                <div className="mt-4 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                                                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1">Chef Notes</p>
                                                    <p className="text-xs text-gray-300 italic">{order.notes}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 border-t border-gray-800 bg-gray-900/30 grid grid-cols-2 gap-3">
                                            {order.status === 'Pending' && (
                                                <Button 
                                                    onClick={() => updateStatus(order._id, 'Accepted')}
                                                    className="col-span-2 py-2 text-xs"
                                                >
                                                    Accept Order
                                                </Button>
                                            )}
                                            {order.status === 'Accepted' && (
                                                <Button 
                                                    onClick={() => updateStatus(order._id, 'Preparing')}
                                                    className="col-span-2 py-2 text-xs bg-orange-500 text-white"
                                                >
                                                    Start Preparing
                                                </Button>
                                            )}
                                            {order.status === 'Preparing' && (
                                                <Button 
                                                    onClick={() => updateStatus(order._id, 'Ready')}
                                                    className="col-span-2 py-2 text-xs bg-green-600 text-white"
                                                >
                                                    Mark as Ready
                                                </Button>
                                            )}
                                            {order.status === 'Ready' && (
                                                <Button 
                                                    onClick={() => updateStatus(order._id, 'Served')}
                                                    className="col-span-2 py-2 text-xs"
                                                >
                                                    Mark as Served
                                                </Button>
                                            )}
                                            {order.status === 'Served' && (
                                                <div className="col-span-2 py-2 text-xs text-center font-bold text-gray-500 uppercase tracking-widest">
                                                    Completed
                                                </div>
                                            )}
                                            {order.status !== 'Served' && order.status !== 'Cancelled' && (
                                                <button 
                                                    onClick={() => updateStatus(order._id, 'Cancelled')}
                                                    className="col-span-2 text-[10px] text-gray-500 hover:text-red-500 font-black uppercase tracking-widest transition-colors"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {!loading && orders.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-gray-700">
                                <Clock size={40} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest">No Active Orders</h2>
                            <p className="text-gray-600 text-sm">New orders from customers will appear here automatically.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
