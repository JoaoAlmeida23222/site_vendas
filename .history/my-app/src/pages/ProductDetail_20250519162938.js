import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';
import Footer from '../components/Footer';

const ProductDetail = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  if (!product) return <div className="product-detail-page">No product found.</div>;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    alert(`${product.name} added to cart`);
  };

  return (
    <div className="product-detail-page">
      <Navbar />
      <div className="product-detail-wrapper">
        <div className="product-main-image">
          <img src={product.image_url} alt={product.name} />
        </div>
  
        <div className="product-detail-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-subtitle">{product.description || 'No description provided.'}</p>
          <p className="product-price">${Number(product.price).toFixed(2)}</p>
  
          <div className="product-long-description">
            <p>{product.long_description || 'No additional information available.'}</p>
          </div>
  
          <div className="product-actions">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
