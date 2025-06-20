import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { addToCart } = useCart();

  const images = product.image_urls?.length ? product.image_urls : [product.image_url];
  const [mainImage, setMainImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    alert(`${product.name} added to cart`);
  };

  if (!product) return <div className="product-detail-page">No product found.</div>;

  return (
    <div className="product-detail-page">
      <Navbar />
      <div className="product-detail-container">
        {/* Left: Image Gallery */}
        <div className="product-detail-gallery">
          <div className="product-thumbnails">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                className={mainImage === img ? 'active' : ''}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <div className="product-main-image">
            <img src={mainImage} alt={product.name} />
          </div>
        </div>

        {/* Right: Info */}
        <div className="product-detail-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-subtitle">{product.description || 'No description provided.'}</p>
          <p className="product-price">${Number(product.price).toFixed(2)}</p>

          <div className="product-actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

          <div className="product-long-description">
            <p>{product.long_description || 'No additional information available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
