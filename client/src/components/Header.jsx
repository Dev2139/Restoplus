import React from 'react';
import { ShoppingCart, LogOut, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ isAdmin = false }) => {
    const { cartCount, tableNumber } = useCart();
    const { user, logout } = useAuth();
    const location = useLocation();

    if (isAdmin) {
        return (
            <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <UtensilsCrossed className="text-primary w-8 h-8" />
                    <span className="text-2xl font-black italic tracking-tighter">RESTOPLUS <span className="text-primary text-sm not-italic font-normal">ADMIN</span></span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-gray-400 hidden sm:inline">Welcome, <span className="text-white font-bold">{user?.username}</span></span>
                    <button 
                        onClick={logout}
                        className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-bold"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to={tableNumber ? `/table/${tableNumber}` : '/'} className="flex items-center gap-2">
                <UtensilsCrossed className="text-primary w-6 h-6" />
                <span className="text-xl font-black italic tracking-tighter">RESTO<span className="text-primary">PLUS</span></span>
            </Link>
            
            <div className="flex items-center gap-4">
                {tableNumber && (
                    <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/30">
                        TABLE {tableNumber}
                    </div>
                )}
                <Link to="/cart" className="relative p-2 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                    <ShoppingCart className="text-white w-6 h-6" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
                            {cartCount}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
};

export default Header;
