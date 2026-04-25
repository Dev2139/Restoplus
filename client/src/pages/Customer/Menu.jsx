import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Search, Filter, ArrowRight, X, Leaf, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
import MenuItemCard from '../../components/MenuItemCard';
import { motion, AnimatePresence } from 'framer-motion';
import { UPLOAD_URL } from '../../services/api';

const Menu = () => {
    const { tableNumber: tableParam } = useParams();
    const { setTableNumber, addToCart, removeFromCart, updateQuantity, cartItems, cartTotal, cartCount, setSessionId } = useCart();
    const [menuItems, setMenuItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [vegOnly, setVegOnly] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const categories = ['All', ...new Set(menuItems.map(item => item.category))];

    useEffect(() => {
        if (tableParam) {
            setTableNumber(tableParam);
            fetchSession(tableParam);
        }
        fetchMenu();
    }, [tableParam]);

    const fetchSession = async (tableNum) => {
        try {
            const { data } = await api.get(`/tables/${tableNum}/session`);
            setSessionId(data.sessionId);
        } catch (error) {
            console.error('Error fetching table session', error);
        }
    };

    useEffect(() => {
        let result = menuItems;
        if (activeCategory !== 'All') {
            result = result.filter(item => item.category === activeCategory);
        }
        if (vegOnly) {
            result = result.filter(item => item.isVeg);
        }
        if (search) {
            result = result.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        }
        setFilteredItems(result);
    }, [activeCategory, vegOnly, search, menuItems]);

    const fetchMenu = async () => {
        try {
            const { data } = await api.get('/menu');
            setMenuItems(data);
            setFilteredItems(data);
        } catch (error) {
            console.error('Error fetching menu', error);
        } finally {
            setLoading(false);
        }
    };

    const getItemQuantity = (id) => {
        const item = cartItems.find(i => i._id === id);
        return item ? item.quantity : 0;
    };

    return (
        <div className="pb-24">
            <Header />
            
            <div className="px-4 pt-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-black mb-1">Welcome to <span className="text-primary italic">RESTOPLUS</span></h1>
                    <p className="text-gray-400">Discover our delicious menu items</p>
                </div>

                {/* Search and Filter */}
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search dishes..."
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary transition-colors text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                        <button 
                            onClick={() => setVegOnly(!vegOnly)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full border-2 transition-all font-bold text-sm ${vegOnly ? 'bg-green-600/20 border-green-600 text-green-500' : 'bg-gray-900 border-gray-800 text-gray-400'}`}
                        >
                            Veg Only
                        </button>
                        <div className="w-[2px] h-6 bg-gray-800 flex-shrink-0"></div>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex-shrink-0 px-5 py-2 rounded-full border-2 transition-all font-bold text-sm ${activeCategory === cat ? 'bg-primary border-primary text-black' : 'bg-gray-900 border-gray-800 text-gray-400'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Items Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-6 bg-white sm:bg-transparent rounded-2xl sm:rounded-none overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="card sm:card h-28 sm:h-80 animate-pulse bg-gray-100 sm:bg-gray-900 border-b sm:border-none border-gray-200"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-6 bg-white sm:bg-transparent rounded-2xl sm:rounded-none overflow-hidden">
                        <AnimatePresence>
                            {filteredItems.map(item => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-b border-gray-100 sm:border-none last:border-b-0"
                                >
                                    <MenuItemCard 
                                        item={item} 
                                        onAdd={addToCart} 
                                        onRemove={updateQuantity.bind(null, item._id, getItemQuantity(item._id) - 1)}
                                        quantity={getItemQuantity(item._id)}
                                        onClick={setSelectedItem}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
                
                {!loading && filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl">No items found matching your filters.</p>
                    </div>
                )}
            </div>

            {/* Bottom Floating Cart Bar */}
            <AnimatePresence>
                {cartCount > 0 && (
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-6 left-4 right-4 z-50"
                    >
                        <Link 
                            to="/cart" 
                            className="yellow-gradient p-4 rounded-2xl flex justify-between items-center shadow-2xl shadow-primary/20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-black text-primary font-black w-8 h-8 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </div>
                                <div className="text-black">
                                    <p className="text-xs font-bold uppercase opacity-70">Proceed to View</p>
                                    <p className="text-lg font-black tracking-tight">VIEW CART</p>
                                </div>
                            </div>
                            <div className="text-black text-right flex items-center gap-3">
                                <div>
                                    <p className="text-xs font-bold uppercase opacity-70">Total</p>
                                    <p className="text-lg font-black tracking-tight">₹{cartTotal}</p>
                                </div>
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Item Details Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedItem(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="relative bg-white sm:bg-gray-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
                        >
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-colors"
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="relative h-64 sm:h-80 w-full flex-shrink-0">
                                <img 
                                    src={selectedItem.image ? (selectedItem.image.startsWith('http') ? selectedItem.image : `${UPLOAD_URL}${selectedItem.image}`) : 'https://images.unsplash.com/photo-1626779816240-fc866164d1f2?auto=format&fit=crop&q=80&w=800'}
                                    alt={selectedItem.name}
                                    className="w-full h-full object-cover"
                                />
                                {selectedItem.isVeg && (
                                    <div className="absolute top-4 left-4 bg-white/90 p-1.5 rounded-md shadow-lg">
                                        <Leaf className="text-green-600 w-5 h-5" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6 flex flex-col flex-grow overflow-y-auto">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-black text-black sm:text-white leading-tight pr-4">{selectedItem.name}</h2>
                                    <span className="text-xl font-black text-[#ea580c] sm:text-primary whitespace-nowrap">₹{selectedItem.price}</span>
                                </div>
                                
                                <p className="text-gray-600 sm:text-gray-400 text-base leading-relaxed mb-6">
                                    {selectedItem.description || 'No detailed description available for this item.'}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-gray-100 sm:border-gray-800">
                                    {getItemQuantity(selectedItem._id) > 0 ? (
                                        <div className="flex items-center justify-between border-2 border-[#ea580c] sm:border-primary rounded-xl p-2 bg-[#ea580c]/10 sm:bg-primary/10">
                                            <button 
                                                onClick={() => updateQuantity(selectedItem._id, getItemQuantity(selectedItem._id) - 1)}
                                                className="p-3 hover:bg-[#ea580c]/20 sm:hover:bg-primary/20 rounded-lg transition-colors"
                                            >
                                                <Minus className="w-6 h-6 text-[#ea580c] sm:text-primary" />
                                            </button>
                                            <span className="text-2xl font-black text-[#ea580c] sm:text-white px-6">{getItemQuantity(selectedItem._id)}</span>
                                            <button 
                                                onClick={() => addToCart(selectedItem)}
                                                className="p-3 hover:bg-[#ea580c]/20 sm:hover:bg-primary/20 rounded-lg transition-colors"
                                            >
                                                <Plus className="w-6 h-6 text-[#ea580c] sm:text-primary" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            className="w-full bg-[#ea580c] sm:bg-primary text-white sm:text-black py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                            onClick={() => addToCart(selectedItem)}
                                            disabled={!selectedItem.isAvailable}
                                        >
                                            {selectedItem.isAvailable ? 'Add to Cart' : 'Currently Unavailable'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>
            {" .scrollbar-none::-webkit-scrollbar { display: none; } .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; } "}
            </style>
        </div>
    );
};

export default Menu;
