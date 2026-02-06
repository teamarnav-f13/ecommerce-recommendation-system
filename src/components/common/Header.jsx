import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import SearchBar from './SearchBar';

function Header({ user, signOut }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(3); // Mock for now

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