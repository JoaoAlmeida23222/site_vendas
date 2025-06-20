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
  const [selectedImage, setSelectedImage] = useState(product?.image_url || '');

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

  return (
    <div className="product-detail-page">
      <Navbar />
      <div className="product-detail-container">
        {/* LEFT: Images */}
        <div className="product-images">
          {product.images?.length > 1 && (
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
          <div className="main-image">
            <img src={selectedImage || product.image_url} alt={product.name} />
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          <div className="buttons">
            <button className="add-to-cart-btn" onClick={() => addToCart(product)}>Add to Cart</button>
            <button className="back-btn" onClick={() => navigate('/products')}>Back to Products</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
