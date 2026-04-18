import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { UPLOAD_URL } from '../../services/api';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus, Send, ClipboardList } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { motion } from 'framer-motion';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, removeFromCart, updateQuantity, tableNumber, clearCart, sessionId } = useCart();
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const placeOrder = async () => {
        if (cartItems.length === 0) return;
        setLoading(true);
        try {
            const orderData = {
                tableNumber,
                sessionId, // SECURE SESSION ID
                items: cartItems.map(item => ({
                    menuItem: item._id,
                    quantity: item.quantity,
                    notes: item.notes || ''
                })),
                totalAmount: cartTotal,
                notes
            };

            const { data } = await api.post('/orders', orderData);
            clearCart();
            navigate(`/order-tracking/${data._id}`);
        } catch (error) {
            console.error('Error placing order', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-black">
                <Header />
                <div className="flex flex-col items-center justify-center p-8 mt-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center">
                        <ShoppingBag size={48} className="text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold">Your cart is empty</h2>
                    <p className="text-gray-500 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
                    <Link to={tableNumber ? `/table/${tableNumber}` : '/'}>
                        <Button className="px-8">Back to Menu</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pb-32">
            <Header />
            
            <div className="px-4 py-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 font-bold"
                >
                    <ArrowLeft size={20} />
                    Back to Menu
                </button>

                <h1 className="text-3xl font-black mb-6">Review <span className="text-primary italic">Order</span></h1>

                {/* Items List */}
                <div className="space-y-4 mb-8">
                    {cartItems.map((item) => (
                        <motion.div 
                            key={item._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 flex gap-4"
                        >
                            <img 
                                src={item.image ? `${UPLOAD_URL}${item.image}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200'} 
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-xl"
                            />
                            <div className="flex-grow flex flex-col justify-between">
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-primary font-bold">₹{item.price * item.quantity}</p>
                                </div>
                                
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-3 bg-black rounded-lg p-1 border border-gray-700">
                                        <button 
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="p-1 hover:text-primary transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="p-1 hover:text-primary transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Special Instructions */}
                <div className="mb-8">
                    <label className="flex items-center gap-2 text-primary font-bold mb-2 text-sm uppercase tracking-widest">
                        <     ClipboardList size={16} />
                        Special Instructions
                    </label>
                    <textarea 
                        placeholder="Add cooking notes, allergy info, etc..."
                        className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 h-24 focus:outline-none focus:border-primary text-white resize-none"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                {/* Summary */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
                    <div className="flex justify-between text-gray-400">
                        <span>Items Total</span>
                        <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>GST (5%)</span>
                        <span>₹{Math.round(cartTotal * 0.05)}</span>
                    </div>
                    <div className="h-[1px] bg-gray-800"></div>
                    <div className="flex justify-between text-xl font-bold">
                        <span>Grand Total</span>
                        <span className="text-primary">₹{Math.round(cartTotal * 1.05)}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Place Order Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/80 backdrop-blur-xl border-t border-gray-800 z-50">
                <Button 
                    className="w-full flex items-center justify-center gap-3 h-14"
                    onClick={placeOrder}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Send size={20} />
                            <span className="text-lg">Place Order</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default Cart;
