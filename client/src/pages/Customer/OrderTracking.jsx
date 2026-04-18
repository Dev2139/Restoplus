import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { CheckCircle2, Clock, Utensils, CheckCircle, ArrowRight, Table, AlertCircle } from 'lucide-react';
import Header from '../../components/Header';
import { useSocket } from '../../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

const OrderTracking = () => {
    const { orderId } = useParams();
    const { socket, joinTable } = useSocket();
    
    // Core State
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeOrders, setActiveOrders] = useState([]);
    const [showFinalBill, setShowFinalBill] = useState(false);

    const statusSteps = [
        { status: 'Pending', label: 'Order Placed', icon: Clock },
        { status: 'Accepted', label: 'Accepted', icon: CheckCircle2 },
        { status: 'Preparing', label: 'Preparing', icon: Utensils },
        { status: 'Ready', label: 'Ready to Serve', icon: CheckCircle },
        { status: 'Served', label: 'Served', icon: CheckCircle },
    ];

    // 1. Initial Data Fetch
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/orders/${orderId}`);
                setOrder(data);
                joinTable(data.tableNumber);
                await fetchActiveOrders(data.tableNumber);
            } catch (error) {
                console.error('Error loading tracking data', error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [orderId]);

    // 2. Socket Listeners
    useEffect(() => {
        if (socket && order?.tableNumber) {
            const handleUpdate = (updatedOrder) => {
                // If this is our current tracking order, update status
                if (updatedOrder._id === orderId) {
                    setOrder(updatedOrder);
                }
                // Refresh full table session if the update is for our table
                if (updatedOrder.tableNumber === order.tableNumber) {
                    fetchActiveOrders(order.tableNumber);
                }
            };

            const handleNewOrder = (newOrder) => {
                if (newOrder.tableNumber === order.tableNumber) {
                    fetchActiveOrders(order.tableNumber);
                }
            };

            socket.on('status_update', handleUpdate);
            socket.on('order_updated', handleUpdate);
            socket.on('new_order', handleNewOrder);

            return () => {
                socket.off('status_update', handleUpdate);
                socket.off('order_updated', handleUpdate);
                socket.off('new_order', handleNewOrder);
            };
        }
    }, [socket, orderId, order?.tableNumber]);

    const fetchActiveOrders = async (tableNum) => {
        try {
            const { data } = await api.get(`/orders/table/${tableNum}/active`);
            setActiveOrders(data);
        } catch (error) {
            console.error('Error fetching active orders', error);
        }
    };

    const getStatusIndex = (status) => {
        return statusSteps.findIndex(step => step.status === status);
    };

    const calculateSessionTotal = () => {
        const subtotal = activeOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
        const gst = Math.round(subtotal * 0.05);
        return { subtotal, gst, grandTotal: subtotal + gst };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-black">
                <Header />
                <div className="text-center p-8 mt-20">
                    <h2 className="text-2xl font-bold">Order Not Found</h2>
                    <Link to="/" className="text-primary hover:underline mt-4 block">Return to Menu</Link>
                </div>
            </div>
        );
    }

    const currentStatusIndex = getStatusIndex(order.status);
    const sessionBill = calculateSessionTotal();

    return (
        <div className="min-h-screen bg-black relative">
            <Header />
            
            <div className="px-4 py-8 max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter italic">Tracking Your <span className="text-primary font-bold">FEAST</span></h1>
                    <p className="text-gray-400">Order Ref: #{orderId.slice(-6).toUpperCase()}</p>
                    <div className="inline-flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full mt-4 border border-gray-800 shadow-xl shadow-primary/5">
                        <Table size={16} className="text-primary" />
                        <span className="font-bold text-sm">Table Number: {order.tableNumber}</span>
                    </div>
                </div>

                {/* Status Tracker */}
                <div className="space-y-8 relative mb-12 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gray-800">
                    {statusSteps.map((step, index) => {
                        const isCompleted = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        
                        return (
                            <motion.div 
                                key={step.status}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-6 relative"
                            >
                                <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-black border-gray-800'}`}>
                                    <step.icon size={20} className={isCompleted ? 'text-black' : 'text-gray-600'} />
                                    {isCurrent && (
                                        <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
                                    )}
                                </div>
                                
                                <div className="pt-1">
                                    <h3 className={`font-bold text-lg ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
                                        {step.label}
                                    </h3>
                                    {isCurrent && (
                                        <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">
                                            Currently in this stage
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Session Bill Summary */}
                <div className="bg-gray-900/50 border-2 border-primary/20 rounded-3xl p-6 shadow-2xl shadow-primary/5 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black uppercase italic">Live <span className="text-primary not-italic">Bill</span></h3>
                        <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded border border-primary/20 uppercase">
                            Session Total
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2 pb-4 border-b border-gray-800">
                            {activeOrders.flatMap(ord => ord.items).map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-300">
                                        <span className="text-primary font-bold mr-2 text-xs">x{item.quantity}</span>
                                        {item.menuItem?.name || 'Loading item...'}
                                    </span>
                                    <span className="font-bold text-white">₹{(item.menuItem?.price || 0) * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 space-y-2">
                            <div className="flex justify-between text-gray-400 text-xs">
                                <span>Subtotal</span>
                                <span>₹{sessionBill.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-xs">
                                <span>Tax (GST 5%)</span>
                                <span>₹{sessionBill.gst}</span>
                            </div>
                            <div className="h-[1px] bg-gray-800 my-2"></div>
                            <div className="flex justify-between text-2xl font-black italic tracking-tighter">
                                <span>TOTAL BILL</span>
                                <span className="text-primary not-italic animate-pulse">₹{sessionBill.grandTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {order.status === 'Served' ? (
                        <button 
                            onClick={() => setShowFinalBill(true)}
                            className="w-full py-4 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all shadow-xl shadow-primary/10"
                        >
                            <CheckCircle size={20} /> GENERATE FINAL SUMMARY
                        </button>
                    ) : (
                        <p className="text-gray-500 italic text-[10px] uppercase font-bold tracking-widest text-center mb-4">Cooking with love. Please wait...</p>
                    )}
                    
                    <Link to={`/table/${order.tableNumber}`}>
                        <button className="w-full py-4 border-2 border-gray-800 text-gray-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:border-primary/50 hover:text-primary transition-all">
                            <Utensils size={20} /> ADD MORE ITEMS
                        </button>
                    </Link>
                </div>
            </div>

            {/* Final Bill Modal */}
            <AnimatePresence>
                {showFinalBill && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white text-black w-full max-w-md rounded-[40px] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
                            
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-1">Resto<span className="text-primary italic">Plus</span></h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Table Payment Summary</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs font-black border-b-2 border-gray-100 pb-2">
                                    <span>ITEM</span>
                                    <span>PRICE</span>
                                </div>
                                <div className="max-h-[30vh] overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                                    {activeOrders.flatMap(ord => ord.items).map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="font-bold text-gray-700">
                                                <span className="text-primary mr-2">{item.quantity}x</span>
                                                {item.menuItem?.name || 'Dish'}
                                            </span>
                                            <span className="font-black">₹{(item.menuItem?.price || 0) * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-3xl p-6 space-y-2 mb-8 border border-gray-100">
                                <div className="flex justify-between text-sm font-bold text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{sessionBill.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-gray-500">
                                    <span>GST (5%)</span>
                                    <span>₹{sessionBill.gst}</span>
                                </div>
                                <div className="h-[2px] bg-gray-200 my-2"></div>
                                <div className="flex justify-between text-3xl font-black italic tracking-tighter">
                                    <span>GRAND TOTAL</span>
                                    <span className="text-primary not-italic">₹{sessionBill.grandTotal}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowFinalBill(false)}
                                className="w-full py-4 bg-black text-white font-black rounded-2xl uppercase tracking-widest text-sm hover:bg-gray-900 transition-all"
                            >
                                Close Summary
                            </button>
                            
                            <p className="text-center text-[8px] font-black text-gray-400 uppercase tracking-widest mt-6">Please show this summary to the table manager for payment</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderTracking;
