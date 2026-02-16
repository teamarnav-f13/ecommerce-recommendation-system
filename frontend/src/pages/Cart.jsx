import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
  // Load cart from localStorage
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
    // Update quantity in state
    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    
    // Update localStorage
    localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));
    
    // Trigger cart update event for header
    window.dispatchEvent(new Event('cart-updated'));
    
    console.log('Quantity updated, cart saved');
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
};

  const handleRemoveItem = (itemId) => {
  try {
    // Remove item from cart
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    
    // Update localStorage
    localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));
    
    // Trigger cart update event for header
    window.dispatchEvent(new Event('cart-updated'));
    
    console.log('Item removed, cart updated');
  } catch (error) {
    console.error('Error removing item:', error);
  }
};

  const handleClearCart = () => {
  if (window.confirm('Are you sure you want to clear your cart?')) {
    setCartItems([]);
    localStorage.removeItem('shopping_cart');
    
    // Trigger cart update event for header
    window.dispatchEvent(new Event('cart-updated'));
    
    console.log('Cart cleared');
  }
};

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Checkout functionality coming soon!');
    // Navigate to checkout page when implemented
    // navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <ShoppingBag size={80} strokeWidth={1.5} />
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <button 
          className="btn-continue-shopping"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const shipping = calculateShipping();
  const total = calculateTotal();

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span>Continue Shopping</span>
        </button>
        <h1>Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h1>
        <button className="clear-cart-button" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items-section">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              {/* Product Image */}
              <div 
                className="cart-item-image"
                onClick={() => navigate(`/product/${item.product_id}`)}
              >
                <img src={item.image_url} alt={item.product_name} />
              </div>

              {/* Product Info */}
              <div className="cart-item-info">
                <h3 
                  className="cart-item-name"
                  onClick={() => navigate(`/product/${item.product_id}`)}
                >
                  {item.product_name}
                </h3>
                <p className="cart-item-vendor">Sold by {item.vendor_name}</p>
                
                {item.stock_quantity < 10 && (
                  <p className="cart-item-stock-warning">
                    Only {item.stock_quantity} left in stock
                  </p>
                )}

                <p className="cart-item-price-mobile">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="cart-item-quantity">
                <label>Quantity</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    min="1"
                    max={item.stock_quantity}
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock_quantity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="cart-item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              {/* Remove Button */}
              <button
                className="cart-item-remove"
                onClick={() => removeItem(item.id)}
                title="Remove from cart"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'free-shipping' : ''}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          {shipping > 0 && (
            <div className="shipping-message">
              Add ${(50 - subtotal).toFixed(2)} more for FREE shipping
            </div>
          )}

          <div className="summary-row">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button 
            className="btn-checkout"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>

          <div className="secure-checkout-message">
            🔒 Secure checkout with 256-bit encryption
          </div>

          {/* Accepted Payment Methods */}
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
