import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold tracking-wider text-orange-500">RESTO<span className="text-white">PLUS</span></span>
            </div>
            <div className="flex space-x-4">
              <Link to="/admin/login" className="px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors duration-300">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.15),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
              Revolutionize Your <br/>
              <span className="text-orange-500 bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 animate-pulse">Dining Experience</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
              RestoPlus brings seamless QR-code ordering, real-time kitchen management, and advanced analytics to modern restaurants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link to="/table/1" className="px-8 py-3 rounded-full font-semibold text-black bg-orange-500 hover:bg-orange-600 hover:scale-105 transform transition-all duration-300 shadow-lg shadow-orange-500/30 text-center">
                Try Customer Demo (Table 1)
              </Link>
              <Link to="/admin/login" className="px-8 py-3 rounded-full font-semibold text-white border-2 border-orange-500/50 hover:border-orange-500 hover:bg-orange-500/10 transform transition-all duration-300 text-center">
                Explore Admin Portal
              </Link>
            </div>
          </div>
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <img 
              src="/images/hero.png" 
              alt="Modern Restaurant Ordering" 
              className="rounded-2xl border border-orange-500/20 shadow-2xl shadow-orange-500/10 transform group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black via-zinc-900 to-black border-y border-orange-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-500">Powerful Features</h2>
            <p className="text-gray-400">Everything you need to run a modern, contactless, and efficient restaurant.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-500 transition-colors">QR Code Ordering</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Customers scan the QR code at their table, browse the beautiful digital menu, and order directly from their phone.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-500 transition-colors">Instant Kitchen Sync</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Orders are sent directly to the kitchen display system in real-time, minimizing delays and ordering errors.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10m5 0h3a2 2 0 002-2v-3a2 2 0 00-2-2h-3m5 0h3a2 2 0 002-2v-7a2 2 0 00-2-2h-3" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-500 transition-colors">Smart Analytics</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Track sales performance, popular dishes, and peak hours with comprehensive visual reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 order-2 md:order-1">
              <h3 className="text-2xl md:text-3xl font-bold text-orange-500">Effortless for Customers</h3>
              <p className="text-gray-300 leading-relaxed">
                Give your guests the freedom to order at their own pace. With RestoPlus, they can browse high-quality images of your dishes, view allergen information, and customize their orders without waiting for a waiter.
              </p>
              <div className="flex items-center space-x-3 text-orange-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 5" /></svg>
                <span>No app download required</span>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2 relative group">
              <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-2xl"></div>
              <img src="/images/qr.png" alt="Scanning QR Code" className="rounded-2xl border border-orange-500/20 transform group-hover:scale-[1.02] transition-all duration-500 shadow-xl" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-2xl"></div>
              <img src="/images/dashboard.png" alt="Admin Dashboard" className="rounded-2xl border border-orange-500/20 transform group-hover:scale-[1.02] transition-all duration-500 shadow-xl" />
            </div>
            <div className="flex-1 space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-orange-500">Empowering for Management</h3>
              <p className="text-gray-300 leading-relaxed">
                Take full control of your restaurant operations. Update your menu instantly, track table statuses, view live order queues, and make data-driven decisions to maximize efficiency and profitability.
              </p>
              <div className="flex items-center space-x-3 text-orange-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 5" /></svg>
                <span>Real-time menu & table updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-t from-zinc-950 to-black border-t border-orange-500/10">
        <div className="max-w-4xl mx-auto text-center px-4 space-y-8">
          <h2 className="text-3xl md:text-5xl font-black">Ready to Upgrade Your Restaurant?</h2>
          <p className="text-xl text-gray-400">Join the future of hospitality with RestoPlus today.</p>
          <div className="flex justify-center gap-6">
            <Link to="/admin/login" className="px-10 py-4 rounded-full font-bold text-black bg-orange-500 hover:bg-orange-600 hover:scale-105 transform transition-all duration-300 shadow-xl shadow-orange-500/30">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-800/50 text-center text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} RestoPlus. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link to="/admin/login" className="hover:text-orange-500 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
