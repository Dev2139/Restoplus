import React, { useState } from 'react';
import { ShoppingCart, LogOut, LayoutDashboard, UtensilsCrossed, Menu, X, Utensils, QrCode, BarChart3 } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ isAdmin = false }) => {
    const { cartCount, tableNumber } = useCart();
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Live Orders', icon: LayoutDashboard, path: '/admin' },
        { name: 'Menu Mgmt', icon: Utensils, path: '/admin/menu' },
        { name: 'Table & QR', icon: QrCode, path: '/admin/tables' },
        { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    ];

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
                        className="hidden md:flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-bold"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="md:hidden text-gray-400 hover:text-primary transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="absolute top-[72px] left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 flex flex-col gap-4 md:hidden z-50">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    end
                                    className={({ isActive }) => `
                                        flex items-center gap-3 p-3 rounded-xl transition-all
                                        ${isActive 
                                            ? 'bg-primary text-black font-bold shadow-[0_4px_15px_rgba(250,204,21,0.2)]' 
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon size={20} />
                                    <span>{item.name}</span>
                                </NavLink>
                            ))}
                        </nav>
                        <div className="border-t border-gray-800 pt-4">
                            <button 
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    logout();
                                }}
                                className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white w-full text-left font-bold transition-all"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
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
