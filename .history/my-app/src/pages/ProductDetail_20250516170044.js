import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { addToCart } = useCart();

  if (!product) {
    return <div className="product-detail-page">No product data available.</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} added to cart`);
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-image">
        <img src={product.image_url} alt={product.name} />
      </div>
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="product-detail-category">{product.category}</p>
        <p className="product-detail-price">${product.price.toFixed(2)}</p>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
        <div className="product-detail-description">
          <h2>Description</h2>
          <p>{product.description || "No description available."}</p>
        </div>
        <div className="product-detail-specs">
          <h3>Details</h3>
          <ul>
            {product.details?.map((detail, index) => (
              <li key={index}>{detail}</li>
            )) || <li>No details provided.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
