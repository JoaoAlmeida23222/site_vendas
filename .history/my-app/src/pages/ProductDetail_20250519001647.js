import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import './ProductDetail.css';

const ProductDetail = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { addToCart } = useCart();

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | GearFit`;
    }
  }, [product]);

  if (!product) {
    return <div className="product-detail-page">No product data available.</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} added to cart`);
  };

  const formattedPrice = isNaN(Number(product.price))
    ? null
    : Number(product.price).toFixed(2);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.image_url,
    description: product.description,
    sku: product.id,
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: Number(product.price),
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <div className="product-detail-page">
      <Navbar />

      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>

      <main className="product-detail-container">
        <div className="product-images">
          <div className="main-image">
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              width="350"
              height="350"
            />
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-detail-category">{product.category}</p>
          <div className="product-price">
            {formattedPrice ? `$${formattedPrice}` : 'Price Unavailable'}
          </div>

          <div className="product-description">
            <p>{product.description || 'No description available.'}</p>
          </div>

          {product.details?.length > 0 && (
            <div className="product-specs">
              <h2>Specifications</h2>
              <ul>
                {product.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="buttons">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
