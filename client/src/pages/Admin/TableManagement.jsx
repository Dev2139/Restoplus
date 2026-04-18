import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Download, Table as TableIcon, Maximize2, QrCode } from 'lucide-react';
import Button from '../../components/Button';
import { motion } from 'framer-motion';

const TableManagement = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tableNumber, setTableNumber] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const { data } = await api.get('/tables', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTables(data);
        } catch (error) {
            console.error('Error fetching tables', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTable = async (e) => {
        e.preventDefault();
        if (!tableNumber) return;
        try {
            await api.post('/tables', 
                { tableNumber },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setTableNumber('');
            fetchTables();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating table');
        }
    };

    const handleDeleteTable = async (id) => {
        if (!window.confirm('Delete this table and its QR code?')) return;
        try {
            await api.delete(`/tables/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchTables();
        } catch (error) {
            console.error('Error deleting table', error);
        }
    };

    const downloadQR = (qrData, tableNum) => {
        const link = document.createElement('a');
        link.href = qrData;
        link.download = `Table-${tableNum}-QR.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-black">
            <Header isAdmin={true} />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-grow p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Table <span className="text-primary not-italic">Management</span></h1>
                            <p className="text-gray-500 font-bold">Generate QR codes for each restaurant table</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Create Table Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Plus className="text-primary" /> Add New Table
                                </h2>
                                <form onSubmit={handleCreateTable} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Table Number/Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 1, 2, A1, VIP" 
                                            required 
                                            value={tableNumber}
                                            onChange={(e) => setTableNumber(e.target.value)}
                                            className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-sm mt-1"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full py-3">Generate Table & QR</Button>
                                </form>
                                <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                    <p className="text-[10px] text-gray-400 leading-relaxed uppercase font-bold tracking-tighter">
                                        Each table gets a unique QR code. Customers scanning it will be automatically assigned to that table.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tables Grid */}
                        <div className="lg:col-span-2">
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="card h-48 animate-pulse"></div>)}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {tables.map((table) => (
                                        <motion.div 
                                            key={table._id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="card group hover:scale-[1.02] transition-transform"
                                        >
                                            <div className="p-6 flex flex-col items-center">
                                                <div className="w-full flex justify-between items-center mb-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <TableIcon size={16} className="text-primary" />
                                                        </div>
                                                        <span className="font-black text-lg">TABLE {table.tableNumber}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleDeleteTable(table._id)}
                                                        className="text-gray-600 hover:text-red-500 transition-colors p-2"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>

                                                <div className="bg-white p-3 rounded-2xl mb-6 relative group/qr shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                                    <img src={table.qrCode} alt={`QR for Table ${table.tableNumber}`} className="w-32 h-32" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/qr:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                                        <Maximize2 className="text-white" />
                                                    </div>
                                                </div>

                                                <div className="w-full flex gap-3">
                                                    <button 
                                                        onClick={() => downloadQR(table.qrCode, table.tableNumber)}
                                                        className="flex-grow flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-xs font-bold transition-all"
                                                    >
                                                        <Download size={16} /> Download QR
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    
                                    {tables.length === 0 && (
                                        <div className="col-span-full py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800 flex flex-col items-center justify-center text-center">
                                            <QrCode size={48} className="text-gray-700 mb-4" />
                                            <p className="text-gray-500 font-bold uppercase tracking-widest">No Tables Configured</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TableManagement;
