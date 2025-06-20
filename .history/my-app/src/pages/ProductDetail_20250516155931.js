import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';
import Navbar from '../components/Navbar';  // ✅ Add your Navbar for consistent design

const ProductDetail = () => {
  const product = {
    name: 'Creatine Monohydrate',
    brand: 'Zumub',
    price: 34.96,
    oldPrice: 69.99,
    discount: 50,
    description: 'Creatine monohydrate of the highest purity. Boosts performance and helps with muscle recovery.',
    images: [
      '/images/creatine-1.jpg',
      '/images/creatine-2.jpg',
      '/images/creatine-3.jpg',
      '/images/creatine-4.jpg',
    ],
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="product-detail-page">
      <Navbar /> {/* Include the Navbar component for consistent design */}
      <div className="product-detail-container">
        {/* Left: Images */}
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

        {/* Right: Info */}
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

      {/* Description */}
      <div className="product-description">
        <h3>Product Description</h3>
        <p>{product.description}</p>
      </div>
    </div>
  );
};


export default ProductDetail;
