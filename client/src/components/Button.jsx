import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-black font-bold py-2 px-4 rounded-lg transition-all',
        danger: 'bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-all font-bold',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
