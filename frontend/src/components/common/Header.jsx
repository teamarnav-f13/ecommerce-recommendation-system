import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import SearchBar from './SearchBar';

function Header({ user, signOut }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // Initial load
  useEffect(() => {
    updateCartCount();
  }, []);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      updateCartCount();
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    
    // Also listen to storage events (for cross-tab updates)
    window.addEventListener('storage', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const updateCartCount = () => {
    try {
      const savedCart = localStorage.getItem('shopping_cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(count);
        console.log('Cart count updated:', count);
      } else {
        setCartCount(0);
        console.log('Cart is empty');
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartCount(0);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <ShoppingCart size={32} />
          <span>ShopSmart</span>
        </Link>

        {/* Search Bar */}
        <div className="header-search">
          <SearchBar />
        </div>

        {/* User Actions */}
        <div className="header-actions">
          <Link to="/cart" className="cart-button">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <div className="user-menu">
            <User size={24} />
            <span>{user?.signInDetails?.loginId || user?.username || 'Account'}</span>
          </div>

          <button onClick={signOut} className="sign-out-button">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
