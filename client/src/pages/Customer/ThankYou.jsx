import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ThankYou = () => {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600 rounded-full blur-[120px]"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-gray-900/50 border border-gray-800 rounded-[40px] p-10 backdrop-blur-xl relative z-10 text-center"
            >
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                    className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20"
                >
                    <Heart size={44} className="text-black fill-black" />
                </motion.div>

                <h1 className="text-4xl font-black italic uppercase italic tracking-tighter mb-4">
                    THANK <span className="text-primary not-italic">YOU!</span>
                </h1>
                
                <p className="text-gray-400 font-bold mb-10 leading-relaxed">
                    We hope you had a fantastic meal. Your session has been closed, and we look forward to serving you again!
                </p>

                <div className="space-y-4">
                    <div className="bg-black/50 border border-gray-800 rounded-2xl p-6 mb-8 text-left">
                        <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">Feedback</p>
                        <h3 className="text-lg font-bold mb-4">Rate your experience</h3>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} className="text-gray-700 hover:text-primary transition-colors">
                                    <Star size={24} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <Link to="/">
                        <button className="w-full py-4 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all shadow-xl shadow-primary/10 uppercase tracking-widest text-sm">
                            <Home size={18} /> BACK TO HOME
                        </button>
                    </Link>
                </div>

                <p className="mt-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    RESTOPLUS • SMART DINING EXPERIENCE
                </p>
            </motion.div>
        </div>
    );
};

export default ThankYou;
