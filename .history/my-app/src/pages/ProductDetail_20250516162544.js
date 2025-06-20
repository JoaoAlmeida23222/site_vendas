import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';
import Navbar from '../components/Navbar';

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = location.state?.product;
  const [selectedImage, setSelectedImage] = useState(product?.image_url || '');

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

  return (
    <div className="product-detail-page">
      <Navbar />

      <div className="product-detail-container">
        {/* Left: gallery */}
        <div className="product-images">
          {product.images && (
            <div className="thumbnail-list">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={selectedImage === img ? 'active' : ''}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
          <div className="main-image
