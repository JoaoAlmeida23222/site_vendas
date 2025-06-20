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
            <span className="old">€{product.oldPrice
