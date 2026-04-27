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
import Landing from './pages/Landing';

// Admin Pages
import AdminLogin from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import MenuManagement from './pages/Admin/MenuManagement';
import TableManagement from './pages/Admin/TableManagement';
import Analytics from './pages/Admin/Analytics';
import CustomerDashboard from './pages/Admin/CustomerDashboard';

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
                <Route path="/" element={<Landing />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/admin/menu" element={<PrivateRoute><MenuManagement /></PrivateRoute>} />
                <Route path="/admin/tables" element={<PrivateRoute><TableManagement /></PrivateRoute>} />
                <Route path="/admin/customers" element={<PrivateRoute><CustomerDashboard /></PrivateRoute>} />
                <Route path="/admin/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
              </Routes>
            </div>
          </CartProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
