// src/pages/ProductDetail.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);

  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]);

  if (!product) return <p style={{ color: 'white' }}>Product not found</p>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-images">
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
          <div className="main-image">
            <img src={selectedImage} alt="Product" />
          </div>
        </div>

        <div className="product-info">
          <h2>{product.brand}</h2>
          <h1>{product.name}</h1>
          <p className="rating">★★★★☆ (1681 reviews)</p>

          <div className="price">
            <span className="current">€{product.price.toFixed(2)}</span>
            <span className="old">€{product.oldPrice.toFixed(2)}</span>
            <span className="discount">Save {product.discount}%</span>
          </div>

          <div className="variants">
            <label htmlFor="qty">Qty:</label>
            <select id="qty">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <button className="add-to-cart">Add to Cart</button>

          <div className="product-meta">
            <p><strong>Shipping:</strong> Free over €30</p>
            <p><strong>Coupon:</strong> Use code <code>ALL-10</code> for 10% off</p>
            <p><strong>Dispatch:</strong> Ships in 24h</p>
          </div>
        </div>
      </div>

      <div className="product-description">
        <h3>Product Description</h3>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
