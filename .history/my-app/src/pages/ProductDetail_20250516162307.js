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
        {/* Left images */}
        <div className="product-images">
          <div className="main-image">
            <img src={selectedImage} alt={product.name} />
          </div>
          {/* Optionally support additional gallery images in product.images */}
          {product.images && product.images.length > 1 && (
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
        </div>

        {/* Right info */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="detail-price">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
          <p className="detail-description">{product.description}</p>

          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
          <button className="back-btn" onClick={() => navigate('/products')}>
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
