import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Products from './pages/Products';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact'; 
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import AppPresentation from './pages/AppPresentation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';



function App() {
  return (
    <CartProvider>
    <GoogleOAuthProvider clientId="748607643282-r7t9qh00454vcdq32mk2rrdbqj76q2oh.apps.googleusercontent.com">
       <Router> {/* Move Router to be the outermost provider */}
        <AuthProvider>        
        <Toaster
  position="top-center"
  containerStyle={{
    top: '80px' // ✅ Proper top offset without affecting gaps
  }}
  toastOptions={{
    duration: 4000,
    style: {
      
      background: '#1a1a1a',
      color: '#fff',
      fontSize: '0.95rem',
      fontFamily: 'Poppins, sans-serif',
      borderRadius: '10px',
      padding: '14px 20px',
    },
    success: {
      iconTheme: {
        primary: '#22c55e',
        secondary: '#0f0f0f',
      },
    },
    error: {
      iconTheme: {
        primary: '#ef4444',
        secondary: '#0f0f0f',
      },
    },
  }}
/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/produtos" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/app-presentation" element={<AppPresentation />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
    </CartProvider>
  );
}

export default App;
