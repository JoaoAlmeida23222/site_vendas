import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import './Cart.css'; 
import Footer from '../components/Footer'; 
import { showSuccess} from '../components/toastUtils'; 
import { confirmAction } from '../components/toastUtils'; 

const Cart = () => {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, clearCartCompletely } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="cart-page">
      <Navbar />

      {/* Hero Section */}
      <div className="cart-hero">
        <div className="hero-content">
          <h1>Your Cart</h1>
          <p>Ready to checkout?</p>
        </div>
      </div>

      <div className="cart-container">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty </h2>
            <Link to="/products" className="go-shopping-btn">
              Go Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-image">
                    <img
                      src={item.image_url || '/default-product.jpg'}
                      alt={item.name}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>Price: ${Number(item.price).toFixed(2)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Subtotal: ${(Number(item.price) * item.quantity).toFixed(2)}</p>

                  </div>
                  <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      className="edit-btn"
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </button>
                    </div>
                    <button
  className="delete-btn"
  onClick={() =>
    confirmAction({
      message: `Remove "${item.name}" from cart?`,
      onConfirm: () => {
        removeFromCart(item.id);
        showSuccess(`"${item.name}" removed from cart`);
      },
    })
  }
>
  Remove
</button>
                    </div>
                  
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Total: ${totalPrice.toFixed(2)}</h2>
              <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
              <button
  className="clear-cart-btn"
  onClick={() =>
    confirmAction({
      message: "Clear your entire cart?",
      onConfirm: () => {
        clearCartCompletely();
        showSuccess("Cart cleared");
      },
    })
  }
>
  Clear Cart
</button>

            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
