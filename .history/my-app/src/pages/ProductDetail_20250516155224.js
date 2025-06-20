import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';
import Navbar from '../components/Navbar'; // ✅ Add your Navbar for consistent design

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = location.state?.product; // ✅ get product from router state

  if (!product) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="product-detail">
          <h2>Product not found!</h2>
          <button className="delete-btn" onClick={() => navigate('/products')}>Back to Products</button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-detail-page">
      <Navbar />

      <div className="product-detail">
        <div className="detail-card">
          <img 
            src={product.image_url || '/default-product.jpg'} 
            alt={product.name} 
            className="detail-image" 
          />
          <h2>{product.name}</h2>
          <p className="detail-price">    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
          <p className="detail-description">{product.description}</p>

          <div className="button-group">
            <button className="edit-btn" onClick={handleAddToCart}>Add to Cart</button>
            <button className="delete-btn" onClick={() => navigate('/products')}>Back to Products</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
