import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { CheckCircle2, Clock, Utensils, CheckCircle, ArrowRight, Table } from 'lucide-react';
import Header from '../../components/Header';
import { useSocket } from '../../context/SocketContext';
import { motion } from 'framer-motion';

const OrderTracking = () => {
    const { orderId } = useParams();
    const { socket, joinTable } = useSocket();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const statusSteps = [
        { status: 'Pending', label: 'Order Placed', icon: Clock, color: 'text-yellow-500' },
        { status: 'Accepted', label: 'Accepted', icon: CheckCircle2, color: 'text-blue-500' },
        { status: 'Preparing', label: 'Preparing', icon: Utensils, color: 'text-orange-500' },
        { status: 'Ready', label: 'Ready to Serve', icon: CheckCircle, color: 'text-green-500' },
        { status: 'Served', label: 'Served', icon: CheckCircle, color: 'text-primary' },
    ];

    useEffect(() => {
        fetchOrder();

        if (socket) {
            socket.on('status_update', (updatedOrder) => {
                if (updatedOrder._id === orderId) {
                    setOrder(updatedOrder);
                }
            });
        }

        return () => {
            if (socket) socket.off('status_update');
        };
    }, [orderId, socket]);

    const fetchOrder = async () => {
        try {
            const { data } = await api.get(`/orders/${orderId}`);
            setOrder(data);
            joinTable(data.tableNumber);
        } catch (error) {
            console.error('Error fetching order', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIndex = (status) => {
        return statusSteps.findIndex(step => step.status === status);
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

    return (
        <div className="min-h-screen bg-black">
            <Header />
            
            <div className="px-4 py-8 max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter italic">Tracking Your <span className="text-primary font-bold">FEAST</span></h1>
                    <p className="text-gray-400">Order ID: #{order._id.slice(-6).toUpperCase()}</p>
                    <div className="inline-flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full mt-4 border border-gray-800">
                        <Table size={16} className="text-primary" />
                        <span className="font-bold text-sm">Table Number: {order.tableNumber}</span>
                    </div>
                </div>

                {/* Status Tracker */}
                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gray-800">
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
                                <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted ? 'bg-primary border-primary' : 'bg-black border-gray-800'}`}>
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
                                        <p className="text-primary text-sm font-bold mt-1">
                                            Currently in this stage
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Order Summary Card */}
                <div className="mt-12 bg-gray-900/50 border border-gray-800 rounded-3xl p-6">
                    <h3 className="text-xl font-bold mb-4">Items Summary</h3>
                    <div className="space-y-3">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-gray-400">
                                <span>{item.quantity}x {item.menuItem?.name}</span>
                                <span className="text-white font-medium">₹{item.menuItem?.price * item.quantity}</span>
                            </div>
                        ))}
                        <div className="h-[1px] bg-gray-800 my-4"></div>
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total Amount</span>
                            <span className="text-primary">₹{order.totalAmount}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                    {order.status === 'Served' ? (
                        <Link to="/thank-you">
                            <button className="btn-primary w-full flex items-center justify-center gap-2">
                                Complete Experience <ArrowRight size={20} />
                            </button>
                        </Link>
                    ) : (
                        <p className="text-gray-500 italic text-center mb-4">Sit back and relax, your food is on the way!</p>
                    )}
                    
                    <Link to={`/table/${order.tableNumber}`}>
                        <button className="w-full py-4 border-2 border-primary/30 text-primary font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-all">
                            <Utensils size={20} /> ORDER MORE ITEMS
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
