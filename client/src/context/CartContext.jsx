import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [tableNumber, setTableNumber] = useState(null);
    const [sessionId, setSessionId] = useState(localStorage.getItem('restoplus_session_id'));
    const [customerName, setCustomerName] = useState(localStorage.getItem('customer_name') || '');
    const [customerPhone, setCustomerPhone] = useState(localStorage.getItem('customer_phone') || '');

    const saveCustomerDetails = (name, phone) => {
        setCustomerName(name);
        setCustomerPhone(phone);
        localStorage.setItem('customer_name', name);
        localStorage.setItem('customer_phone', phone);
    };

    const addToCart = (item, quantity = 1, notes = '') => {
        setCartItems(prev => {
            const existing = prev.find(i => i._id === item._id);
            if (existing) {
                return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + quantity, notes: notes || i.notes } : i);
            }
            return [...prev, { ...item, quantity, notes }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(i => i._id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return removeFromCart(id);
        setCartItems(prev => prev.map(i => i._id === id ? { ...i, quantity } : i));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const saveSession = (id) => {
        setSessionId(id);
        if (id) {
            localStorage.setItem('restoplus_session_id', id);
        } else {
            localStorage.removeItem('restoplus_session_id');
        }
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            cartTotal, 
            cartCount,
            tableNumber,
            setTableNumber,
            sessionId,
            setSessionId: saveSession,
            customerName,
            customerPhone,
            saveCustomerDetails
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
