import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Products.css';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; // ✅ add this
import Footer from '../components/Footer';
import { showSuccess, showError } from '../components/toastUtils'; // ✅ import toast utils

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate(); // ✅ add navigate function
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://gearfitbackend.onrender.com/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product); // that's it
    showSuccess(`${product.name} added to cart`);
    
  };

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
                    {/* ✅ Quick View navigates to Product Details page */}
                  <button 
                className="quick-shop-btn"
                onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
              >
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <h4 className="product-description">{product.description}</h4>
                  <span className="product-price">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </span>
                  {/* Add to Cart button */}
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    
                  >
                    
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">No products found</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
