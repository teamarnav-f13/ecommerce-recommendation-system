import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function ProductCard({ product }) {
  const { 
    product_id, 
    product_name, 
    price, 
    category, 
    popularity_score,
    images,
    rating,
    review_count
  } = product;

  const [addedToCart, setAddedToCart] = useState(false);

  const productRating = rating || Math.min(5, Math.floor((popularity_score || 50) / 20));
  const imageUrl = (images && images[0]) || `https://picsum.photos/seed/${product_id}/400/400`;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();

    try {
      // Get existing cart
      const savedCart = localStorage.getItem('shopping_cart');
      const currentCart = savedCart ? JSON.parse(savedCart) : [];
      
      // Check if item already in cart
      const existingIndex = currentCart.findIndex(item => item.product_id === product_id);
      
      if (existingIndex >= 0) {
        // Update quantity
        currentCart[existingIndex].quantity += 1;
      } else {
        // Add new item
        currentCart.push({
          id: `CART-${Date.now()}`,
          product_id: product_id,
          product_name: product_name,
          price: price,
          quantity: 1,
          image_url: imageUrl,
          vendor_name: product.vendor_name || 'ShopSmart',
          stock_quantity: product.stock_quantity || 100
        });
      }
      
      // Save to localStorage
      localStorage.setItem('shopping_cart', JSON.stringify(currentCart));
      
      // Show feedback
      setAddedToCart(true);
      
      // Update cart count in header (trigger event)
      window.dispatchEvent(new Event('cart-updated'));
      
      setTimeout(() => setAddedToCart(false), 2000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product_id}`} className="product-image-link">
        <div className="product-image">
          <img 
            src={imageUrl} 
            alt={product_name}
          />
          <button className="wishlist-button" onClick={(e) => e.preventDefault()}>
            <Heart size={20} />
          </button>
        </div>
      </Link>

      <div className="product-info">
        <span className="product-category">{category}</span>
        <Link to={`/product/${product_id}`}>
          <h3 className="product-name">{product_name}</h3>
        </Link>

        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              fill={i < productRating ? '#fbbf24' : 'none'}
              stroke={i < productRating ? '#fbbf24' : '#d1d5db'}
            />
          ))}
          <span className="rating-count">({review_count || popularity_score || 0})</span>
        </div>

        <div className="product-footer">
          <span className="product-price">${price.toFixed(2)}</span>
          <button 
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={addedToCart}
          >
            <ShoppingCart size={18} />
            <span>{addedToCart ? 'Added!' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
