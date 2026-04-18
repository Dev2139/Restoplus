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

    const getStatusStyles = (status) => {
// ... existing code ...
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
