import React from 'react';
import { Plus, Minus, Info, Leaf } from 'lucide-react';
import Button from './Button';
import { UPLOAD_URL } from '../services/api';

const MenuItemCard = ({ item, onAdd, onRemove, quantity = 0 }) => {
    return (
        <div className="flex flex-row sm:flex-col h-full bg-transparent sm:bg-gray-900 sm:border sm:border-gray-800 sm:rounded-xl overflow-hidden sm:transition-all sm:hover:border-primary/50 p-3 sm:p-0">
            {/* Image Container */}
            <div className="relative w-24 h-24 sm:h-48 sm:w-full flex-shrink-0 overflow-hidden rounded-xl sm:rounded-none">
                <img 
                    src={item.image ? (item.image.startsWith('http') ? item.image : `${UPLOAD_URL}${item.image}`) : 'https://images.unsplash.com/photo-1626779816240-fc866164d1f2?auto=format&fit=crop&q=80&w=500'} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                />
                {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-white font-bold text-[10px] sm:text-lg uppercase tracking-widest">Unavailable</span>
                    </div>
                )}
                {item.isVeg && (
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white/90 p-0.5 sm:p-1 rounded-md shadow-sm">
                        <Leaf className="text-green-600 w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                )}
            </div>
            
            {/* Content Container */}
            <div className="ml-4 sm:ml-0 flex flex-col flex-grow sm:p-4 justify-between sm:justify-start">
                <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <h3 className="text-[16px] sm:text-xl font-bold text-black sm:text-white leading-tight">{item.name}</h3>
                </div>
                
                {/* Description hidden on mobile */}
                <p className="hidden sm:block text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                    {item.description || 'No description available.'}
                </p>
                
                <div className="mt-auto flex justify-between items-center sm:pt-2">
                    <span className="text-black sm:text-primary font-bold text-base sm:text-lg whitespace-nowrap">₹{item.price}</span>
                    
                    {quantity > 0 ? (
                        <div className="flex items-center justify-between border sm:border-2 border-[#ea580c] sm:border-primary rounded-lg p-1 bg-[#ea580c]/10 sm:bg-primary/10">
                            <button 
                                onClick={() => onRemove(item._id)}
                                className="p-1 sm:p-2 hover:bg-[#ea580c]/20 sm:hover:bg-primary/20 rounded-md transition-colors"
                            >
                                <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-[#ea580c] sm:text-primary" />
                            </button>
                            <span className="text-base sm:text-xl font-bold text-[#ea580c] sm:text-white px-2 sm:px-4">{quantity}</span>
                            <button 
                                onClick={() => onAdd(item)}
                                className="p-1 sm:p-2 hover:bg-[#ea580c]/20 sm:hover:bg-primary/20 rounded-md transition-colors"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-[#ea580c] sm:text-primary" />
                            </button>
                        </div>
                    ) : (
                        <button 
                            className="bg-[#ea580c] sm:bg-primary sm:w-full text-white sm:text-black px-6 py-1.5 sm:py-2.5 rounded-full sm:rounded-lg font-bold text-sm sm:text-base uppercase sm:tracking-tighter shadow-sm sm:shadow-none transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                            onClick={() => onAdd(item)}
                            disabled={!item.isAvailable}
                        >
                            ADD
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
