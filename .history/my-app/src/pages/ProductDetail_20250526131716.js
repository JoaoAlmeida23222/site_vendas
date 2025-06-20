import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { cartItems, addToCart, decreaseQuantity} = useCart();

  const [quantity, setQuantity] = useState(1);

  if (!product) return <div className="product-detail-page">No product found.</div>;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    alert(`${product.name} added to cart`);
  };

  return (
    <>
      <div className="product-detail-page">
        <Navbar />
        <div className="product-detail-wrapper">
          {/* Left: Main Image */}
          <div className="product-main-image">
            <img src={product.image_url} alt={product.name} />
          </div>

          {/* Right: Info */}
          <div className="product-detail-info">
            <h1 className="product-detail-title">{product.name}</h1>
            <p className="product-detail-subtitle">{product.description || 'No description provided.'}</p>
            <p className="product-detail-price">${Number(product.price).toFixed(2)}</p>

            <div className="product-long-description">
              <p>{product.long_description || 'No additional information available.'}</p>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <button className="qty-btn" onClick={() => decreaseQuantity(product.id)}>-</button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={() => addToCart(product)}>+</button>
              </div>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
