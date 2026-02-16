import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, ShoppingCart } from 'lucide-react';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('shopping_cart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        setCartItems(cartItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    }
    setLoading(false);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      const updatedCart = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cart-updated'));
      console.log('✅ Quantity updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = (itemId) => {
    try {
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);
      localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cart-updated'));
      console.log('✅ Item removed');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
      localStorage.removeItem('shopping_cart');
      window.dispatchEvent(new Event('cart-updated'));
      console.log('✅ Cart cleared');
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <ShoppingCart size={80} />
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <button className="btn-continue-shopping" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <h1>Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h1>
        <div>
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </button>
          {cartItems.length > 0 && (
            <button className="clear-cart-button" onClick={handleClearCart}>
              Clear Cart
            </button>
          )}
        </div>
      </div>

      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items-section">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <Link to={`/product/${item.product_id}`} className="cart-item-image">
                <img src={item.image_url} alt={item.product_name} />
              </Link>

              <div className="cart-item-info">
                <Link to={`/product/${item.product_id}`}>
                  <h3 className="cart-item-name">{item.product_name}</h3>
                </Link>
                <p className="cart-item-vendor">Sold by: {item.vendor_name}</p>
                {item.stock_quantity < 10 && (
                  <p className="cart-item-stock-warning">
                    Only {item.stock_quantity} left in stock!
                  </p>
                )}
                <p className="cart-item-price-mobile">${(item.price * item.quantity).toFixed(2)}</p>
              </div>

              <div className="cart-item-quantity">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    min="1"
                    max={item.stock_quantity}
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock_quantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                className="cart-item-remove"
                onClick={() => handleRemoveItem(item.id)}
                title="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Estimated Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'free-shipping' : ''}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          {subtotal > 0 && subtotal < 50 && (
            <div className="shipping-message">
              Add ${(50 - subtotal).toFixed(2)} more for free shipping!
            </div>
          )}

          <div className="summary-divider"></div>

          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="btn-checkout">
            Proceed to Checkout
          </button>

          <p className="secure-checkout-message">
            🔒 Secure checkout with SSL encryption
          </p>

          <div className="payment-methods">
            <p>We accept:</p>
            <div className="payment-icons">
              <span>💳 Visa</span>
              <span>💳 Mastercard</span>
              <span>💳 Amex</span>
              <span>💰 PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
