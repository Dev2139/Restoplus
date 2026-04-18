import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Navigation, Home, UtensilsCrossed } from 'lucide-react';
import Button from '../../components/Button';
import { motion } from 'framer-motion';

const ThankYou = () => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(250,204,21,0.5)]"
            >
                <Heart size={48} className="text-black fill-black" />
            </motion.div>

            <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-black mb-4 uppercase italic tracking-tighter"
            >
                Hope You <span className="text-primary">Enjoyed!</span>
            </motion.h1>

            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 max-w-sm mb-12"
            >
                Thank you for dining with RestoPlus. Your feedback helps us grow. Feel free to browse the menu again or call for assistance.
            </motion.p>

            <div className="flex flex-col w-full max-w-xs gap-4">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link to="/">
                        <Button className="w-full flex items-center justify-center gap-2">
                             <Home size={20} /> Back to Home
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                         <Star size={20} /> Leave a Review
                    </Button>
                </motion.div>
            </div>

            <div className="mt-20 opacity-30 flex items-center gap-2">
                <UtensilsCrossed size={16} />
                <span className="font-bold text-xs">RESTOPLUS v1.0</span>
            </div>
        </div>
    );
};

export default ThankYou;
