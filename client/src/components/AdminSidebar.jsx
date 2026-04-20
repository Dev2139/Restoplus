import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Utensils, 
    QrCode, 
    BarChart3, 
    Globe,
    ChevronRight 
} from 'lucide-react';

const AdminSidebar = () => {
    const navItems = [
        { name: 'Live Orders', icon: LayoutDashboard, path: '/admin' },
        { name: 'Menu Mgmt', icon: Utensils, path: '/admin/menu' },
        { name: 'Table & QR', icon: QrCode, path: '/admin/tables' },
        { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
        { name: 'Integrations', icon: Globe, path: '/admin/integrations' },
    ];

    return (
        <aside className="w-64 bg-black border-r border-gray-800 h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto hidden md:block">
            <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        className={({ isActive }) => `
                            flex items-center justify-between p-3 rounded-xl transition-all group
                            ${isActive 
                                ? 'bg-primary text-black font-bold shadow-[0_4px_15px_rgba(250,204,21,0.2)]' 
                                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} />
                                    <span>{item.name}</span>
                                </div>
                                <ChevronRight 
                                    size={16} 
                                    className={`transition-transform duration-300 ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`} 
                                />
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
            
            <div className="absolute bottom-8 left-4 right-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[10px] text-primary uppercase font-black tracking-widest mb-1">System Status</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-gray-300">Fast & Responsive</span>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
