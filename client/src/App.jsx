import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';

// Customer Pages
import Menu from './pages/Customer/Menu';
import Cart from './pages/Customer/Cart';
import OrderTracking from './pages/Customer/OrderTracking';
import ThankYou from './pages/Customer/ThankYou';

// Admin Pages
import AdminLogin from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import MenuManagement from './pages/Admin/MenuManagement';
import TableManagement from './pages/Admin/TableManagement';
import Analytics from './pages/Admin/Analytics';
import Integrations from './pages/Admin/Integrations';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <CartProvider>
            <div className="min-h-screen bg-black text-white">
              <Routes>
                {/* Customer Routes */}
                <Route path="/table/:tableNumber" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/" element={<div className="flex items-center justify-center min-h-screen px-4 text-center">
                  <div className="space-y-6">
                    <h1 className="text-5xl font-extrabold text-primary">RestoPlus</h1>
                    <p className="text-xl text-gray-400">Please scan the QR code on your table to browse the menu.</p>
                  </div>
                </div>} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/admin/menu" element={<PrivateRoute><MenuManagement /></PrivateRoute>} />
                <Route path="/admin/tables" element={<PrivateRoute><TableManagement /></PrivateRoute>} />
                <Route path="/admin/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
                <Route path="/admin/integrations" element={<PrivateRoute><Integrations /></PrivateRoute>} />
              </Routes>
            </div>
          </CartProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
