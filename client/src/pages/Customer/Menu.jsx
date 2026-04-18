import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
import MenuItemCard from '../../components/MenuItemCard';
import { motion, AnimatePresence } from 'framer-motion';

const Menu = () => {
    const { tableNumber: tableParam } = useParams();
    const { setTableNumber, addToCart, removeFromCart, updateQuantity, cartItems, cartTotal, cartCount } = useCart();
    const [menuItems, setMenuItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [vegOnly, setVegOnly] = useState(false);

    const categories = ['All', ...new Set(menuItems.map(item => item.category))];

    useEffect(() => {
        setTableNumber(tableParam);
        fetchMenu();
    }, [tableParam]);

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="card h-80 animate-pulse bg-gray-900"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredItems.map(item => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <MenuItemCard 
                                        item={item} 
                                        onAdd={addToCart} 
                                        onRemove={updateQuantity.bind(null, item._id, getItemQuantity(item._id) - 1)}
                                        quantity={getItemQuantity(item._id)}
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

            <style>
            {" .scrollbar-none::-webkit-scrollbar { display: none; } .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; } "}
            </style>
        </div>
    );
};

export default Menu;
