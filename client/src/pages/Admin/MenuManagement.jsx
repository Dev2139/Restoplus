import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Trash } from 'lucide-react';
import Button from '../../components/Button';
import { UPLOAD_URL } from '../../services/api';

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const { user } = useAuth();

    // Form states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [isVeg, setIsVeg] = useState(true);
    const [isAvailable, setIsAvailable] = useState(true);
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const { data } = await api.get('/menu');
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching menu', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setIsVeg(true);
        setIsAvailable(true);
        setImage(null);
        setEditItem(null);
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price);
        setCategory(item.category);
        setIsVeg(item.isVeg);
        setIsAvailable(item.isAvailable);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/menu/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchMenu();
        } catch (error) {
            console.error('Error deleting item', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('isVeg', isVeg);
        formData.append('isAvailable', isAvailable);
        if (image) formData.append('image', image);

        try {
            if (editItem) {
                await api.put(`/menu/${editItem._id}`, formData, {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}` 
                    }
                });
            } else {
                await api.post('/menu', formData, {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}` 
                    }
                });
            }
            setShowModal(false);
            resetForm();
            fetchMenu();
        } catch (error) {
            console.error('Error saving item', error);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <Header isAdmin={true} />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-grow p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Menu <span className="text-primary not-italic">Management</span></h1>
                            <p className="text-gray-500 font-bold">Add, Edit or Remove dishes from the menu</p>
                        </div>
                        <Button 
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="flex items-center gap-2"
                        >
                            <Plus size={20} /> Add New Item
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {menuItems.map((item) => (
                            <div key={item._id} className="card group">
                                <div className="h-40 relative">
                                    <img 
                                        src={item.image ? (item.image.startsWith('http') ? item.image : `${UPLOAD_URL}${item.image}`) : 'https://images.unsplash.com/photo-1626779816240-fc866164d1f2?auto=format&fit=crop&q=80&w=300'} 
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {!item.isAvailable && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-xs font-black uppercase tracking-widest bg-red-600 px-2 py-1 rounded">Unavailable</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-white truncate pr-2">{item.name}</h3>
                                        <span className="text-primary font-black text-sm">₹{item.price}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-4">{item.category}</p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="flex-grow bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="bg-red-900/20 hover:bg-red-900/40 text-red-500 p-2 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                                {editItem ? 'Edit' : 'Add'} <span className="text-primary not-italic font-bold">Menu Item</span>
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Item Name</label>
                                    <input 
                                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (₹)</label>
                                    <input 
                                        type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                                        className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                                    <select 
                                        required value={category} onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-sm"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Starters">Starters</option>
                                        <option value="Main Course">Main Course</option>
                                        <option value="Drinks">Drinks</option>
                                        <option value="Desserts">Desserts</option>
                                        <option value="Chinese">Chinese</option>
                                        <option value="Italian">Italian</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                                    <textarea 
                                        value={description} onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-sm h-[88px] resize-none"
                                    ></textarea>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="checkbox" id="isVeg" checked={isVeg} onChange={(e) => setIsVeg(e.target.checked)}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <label htmlFor="isVeg" className="text-sm font-bold text-gray-300">Vegetarian</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="checkbox" id="isAvailable" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <label htmlFor="isAvailable" className="text-sm font-bold text-gray-300">Available</label>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Image Upload</label>
                                    <div className="mt-1 flex items-center gap-4">
                                        <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                                            <ImageIcon size={16} /> Choose File
                                            <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
                                        </label>
                                        {image && <span className="text-[10px] text-primary truncate max-w-[100px]">{image.name}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 mt-4">
                                <Button type="submit" className="w-full py-3">
                                    {editItem ? 'Update Menu Item' : 'Create Menu Item'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManagement;
