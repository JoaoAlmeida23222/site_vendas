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
import { GoogleOAuthProvider } from '@react-oauth/google';



function App() {
  return (
    <CartProvider>
    <GoogleOAuthProvider clientId="748607643282-r7t9qh00454vcdq32mk2rrdbqj76q2oh.apps.googleusercontent.com">
       <Router> {/* Move Router to be the outermost provider */}
        <AuthProvider>        
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/produtos" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
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
