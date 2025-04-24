import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["All", "Free Weights", "Racks", "Bars", "Benches", "Weight Plates"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products'); // This matches your route
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products); // Access the products array from the response
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="products-page">
        <Navbar />
        <div className="loading-message">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <Navbar />
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <Navbar />
      
      <div className="products-hero">
        <div className="hero-content">
          <h1>Our Equipment</h1>
          <p>Premium quality for your ultimate workout experience</p>
        </div>
      </div>

      <div className="products-container">
        <div className="filters-section">
          <div className="category-filters">
            {categories.map((category) => (
              <button key={category} className="category-button">
                {category}
              </button>
            ))}
          </div>
          
          <div className="sort-filter">
            <select className="sort-select">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <div className="products-grid">
  {products.length > 0 ? (
    products.map((product) => (
      <div key={product.id} className="product-card">
        <div className="product-image">
  {product.image_url ? (
    <img 
    src={product.image_url} 
    alt={product.name}
    className={product.image_url ? 'product-img' : ''}
    onLoad={(e) => e.target.classList.add('loaded')}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = '/default-product.jpg';
    }}
  />
  ) : (
    <div className="no-image-placeholder">
      <span>No Image Available</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    </div>
  )}
  <div className="quick-shop">
    <button className="quick-shop-btn">Quick View</button>
  </div>
</div>
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          <span className="product-price">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </span>
        </div>
      </div>
    ))
  ) : (
    <div className="no-products">No products found</div>
  )}
</div>
      </div>
    </div>
  );
};

export default Products;