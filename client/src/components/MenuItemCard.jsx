import React from 'react';
import { Plus, Minus, Info, Leaf } from 'lucide-react';
import Button from './Button';
import { UPLOAD_URL } from '../services/api';

const MenuItemCard = ({ item, onAdd, onRemove, quantity = 0 }) => {
    return (
        <div className="card flex flex-col h-full">
            <div className="relative h-48 w-full overflow-hidden">
                <img 
                    src={item.image ? `${UPLOAD_URL}${item.image}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500'} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                />
                {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-white font-bold text-lg uppercase tracking-widest">Unavailable</span>
                    </div>
                )}
                {item.isVeg && (
                    <div className="absolute top-2 right-2 bg-white/90 p-1 rounded-md shadow-sm">
                        <Leaf className="text-green-600 w-4 h-4" />
                    </div>
                )}
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white leading-tight">{item.name}</h3>
                    <span className="text-primary font-bold text-lg whitespace-nowrap ml-2">₹{item.price}</span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                    {item.description || 'No description available.'}
                </p>
                
                <div className="mt-auto pt-2">
                    {quantity > 0 ? (
                        <div className="flex items-center justify-between border-2 border-primary rounded-lg p-1 bg-primary/10">
                            <button 
                                onClick={() => onRemove(item._id)}
                                className="p-2 hover:bg-primary/20 rounded-md transition-colors"
                            >
                                <Minus className="w-5 h-5 text-primary" />
                            </button>
                            <span className="text-xl font-bold text-white px-4">{quantity}</span>
                            <button 
                                onClick={() => onAdd(item)}
                                className="p-2 hover:bg-primary/20 rounded-md transition-colors"
                            >
                                <Plus className="w-5 h-5 text-primary" />
                            </button>
                        </div>
                    ) : (
                        <Button 
                            className="w-full py-2.5 font-black uppercase tracking-tighter" 
                            onClick={() => onAdd(item)}
                            disabled={!item.isAvailable}
                        >
                            Add to Cart
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
