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

  const imageGallery = Array.isArray(product.image_urls)
    ? product.image_urls
    : [product.image_url]; // fallback

  return (
    <div className="product-detail-page">
      <Navbar />
      <div className="product-detail-layout">
        {/* Left: Image Gallery */}
        <div className="product-gallery">
          {imageGallery.map((src, index) => (
            <div key={index} className="gallery-image">
              <img src={src} alt={`${product.name} ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* Right: Info */}
        <div className="product-summary">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">
            {product.price ? `$${Number(product.price).toFixed(2)}` : 'Price unavailable'}
          </p>
          <div className="product-description">
            <h2>Description</h2>
            <p>{product.description || 'No description provided.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
