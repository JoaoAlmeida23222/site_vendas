import React from 'react';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Product 1',
      description: 'A sleek and versatile black leather bag',
      price: 120,
      image: 'https://placehold.co/400x300/e2e8f0/1a1a1a.png?text=Leather+Bag'
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'Wireless headphones with a modern design',
      price: 250,
      image: 'https://placehold.co/400x300/e2e8f0/1a1a1a.png?text=Headphones'
    },
    {
      id: 3,
      name: 'Product 3',
      description: 'A minimalist watch with a clean aesthetic',
      price: 180,
      image: 'https://placehold.co/400x300/e2e8f0/1a1a1a.png?text=Watch'
    }
  ];

  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Discover Products That Simplify Your Life</h1>
            <p>Minimalist essentials, thoughtfully curated.</p>
            <button className="hero-button">Shop Now</button>
          </div>
          <div className="hero-image">
            <img
              src="https://placehold.co/600x400/e2e8f0/1a1a1a.png?text=Featured+Product"
              alt="Featured Product"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured">
        <h2>Featured products</h2>
        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-content">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 