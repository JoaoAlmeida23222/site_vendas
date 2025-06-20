import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './ProductDetail.css';

const ProductDetail = () => {
  const location = useLocation();
  const { product } = location.state || {};

  if (!product) {
    return <div className="product-detail-page">No product found.</div>;
  }

  // Gallery fallback — repeat the image 4x if only one is present
  const imageGallery = Array.isArray(product.image_urls) && product.image_urls.length > 0
    ? product.image_urls
    : Array(4).fill(product.image_url); // Repeat to simulate grid

  return (
    <div className="product-detail-page">
      <Navbar />
      <div className="product-detail-layout">
        {/* Image Gallery */}
        <div className="product-detail-gallery">
          {imageGallery.map((src, index) => (
            <div key={index} className="product-detail-gallery-image">
              <img src={src} alt={`${product.name} ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* Product Info */}
        <div className="product-detail-summary">
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-price">
            {product.price ? `$${Number(product.price).toFixed(2)}` : 'Price unavailable'}
          </p>
          <div className="product-detail-description">
            <h2>Description</h2>
            <p>{product.description || 'No description provided.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
