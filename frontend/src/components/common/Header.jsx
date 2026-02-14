import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import SearchBar from './SearchBar';
import { useEffect } from 'react';

function Header({ user, signOut }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
  // Load cart count from localStorage
    const savedCart = localStorage.getItem('shopping_cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch (error) {
        console.error('Error loading cart count:', error);
      }
    }
  }, []);

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
            <span>{user?.signInDetails?.loginId || 'Account'}</span>
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
