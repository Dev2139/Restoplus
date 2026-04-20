import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Save, CheckCircle, XCircle, RefreshCw, Smartphone, Globe } from 'lucide-react';
import Button from '../../components/Button';

const Integrations = () => {
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchPlatforms();
    }, []);

    const fetchPlatforms = async () => {
        try {
            // Need a backend route to fetch platform accounts
            // For now, using mock or existing API if available
            // Let's assume we add GET /api/analytics/platforms
            const { data } = await api.get('/analytics/platforms', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setPlatforms(data);
        } catch (error) {
            console.error('Error fetching platforms', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (id) => {
        setPlatforms(prev => prev.map(p => p._id === id ? { ...p, isActive: !p.isActive } : p));
    };

    const handleSave = async (platform) => {
        setSaving(true);
        try {
            await api.put(`/analytics/platforms/${platform._id}`, platform, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert(`${platform.platform} settings saved!`);
        } catch (error) {
            console.error('Save failed', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <Header isAdmin={true} />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-grow p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">API <span className="text-primary not-italic">Integrations</span></h1>
                        <p className="text-gray-500 font-bold">Connect your Swiggy and Zomato merchant accounts</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {platforms.map((plat) => (
                            <div key={plat._id} className="card p-6 border-gray-800">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${plat.platform === 'Swiggy' ? 'bg-[#ff6b00]/20' : 'bg-[#e03e52]/20'}`}>
                                            {plat.platform === 'Swiggy' ? <Smartphone className="text-[#ff6b00]" /> : <Globe className="text-[#e03e52]" />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{plat.platform}</h3>
                                            <p className="text-xs text-gray-500">Last sync: {plat.lastSync ? new Date(plat.lastSync).toLocaleString() : 'Never'}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle(plat._id)}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all ${
                                            plat.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}
                                    >
                                        {plat.isActive ? 'Active' : 'Disabled'}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1 block">API Key</label>
                                        <input 
                                            type="password" 
                                            value={plat.apiKey || ''} 
                                            onChange={(e) => setPlatforms(prev => prev.map(p => p._id === plat._id ? { ...p, apiKey: e.target.value } : p))}
                                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm focus:border-primary outline-none transition-all"
                                            placeholder="Enter partner API key"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1 block">Merchant ID</label>
                                            <input 
                                                type="text" 
                                                value={plat.merchantId || ''} 
                                                onChange={(e) => setPlatforms(prev => prev.map(p => p._id === plat._id ? { ...p, merchantId: e.target.value } : p))}
                                                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1 block">Commission (%)</label>
                                            <input 
                                                type="number" 
                                                value={plat.commissionRate || 20} 
                                                onChange={(e) => setPlatforms(prev => prev.map(p => p._id === plat._id ? { ...p, commissionRate: e.target.value } : p))}
                                                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => handleSave(plat)}
                                        className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> Save Settings
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-3xl">
                        <h4 className="font-bold flex items-center gap-2 mb-2">
                            <RefreshCw size={18} className="text-primary" /> Auto-Sync Information
                        </h4>
                        <p className="text-sm text-gray-400">
                            The system is currently configured to use your merchant credentials to fetch payment records. 
                            Manual sync is available on the Analytics page, and an automated hourly sync runs in the background.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Integrations;
