import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import './ProductDetail.css';

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = location.state?.product;

  if (!product) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="product-detail-container">
          <h2>Product not found!</h2>
          <button onClick={() => navigate('/products')}>Back to Products</button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image_url];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="product-detail-page">
      <Navbar />
      <div className="product-detail-container">
        {/* LEFT: Image Gallery */}
        <div className="product-images">
          <div className="thumbnail-list">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={selectedImage === img ? 'active' : ''}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
          <div className="main-image">
            <img src={selectedImage} alt={product.name} />
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="product-info">
