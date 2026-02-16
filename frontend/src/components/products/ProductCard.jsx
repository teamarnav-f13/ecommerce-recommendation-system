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
      console.log('ProductCard: Adding to cart...', product_name);

      // Get existing cart from localStorage
      let currentCart = [];
      try {
        const savedCart = localStorage.getItem('shopping_cart');
        if (savedCart) {
          currentCart = JSON.parse(savedCart);
        }
      } catch (parseError) {
        console.error('Error parsing cart:', parseError);
        currentCart = [];
      }
      
      // Check if item already in cart
      const existingIndex = currentCart.findIndex(item => item.product_id === product_id);
      
      if (existingIndex >= 0) {
        // Update quantity of existing item
        currentCart[existingIndex].quantity += 1;
        console.log('ProductCard: Updated existing item quantity');
      } else {
        // Add new item to cart
        const cartItem = {
          id: `CART-${Date.now()}`,
          product_id: product_id,
          product_name: product_name,
          price: price,
          quantity: 1,
          image_url: imageUrl,
          vendor_name: product.vendor_name || 'ShopSmart',
          stock_quantity: product.stock_quantity || 100
        };
        currentCart.push(cartItem);
        console.log('ProductCard: Added new item to cart');
      }
      
      // Save to localStorage
      localStorage.setItem('shopping_cart', JSON.stringify(currentCart));
      console.log('ProductCard: Cart saved to localStorage');
      
      // Trigger cart update event for header
      window.dispatchEvent(new Event('cart-updated'));
      
      // Show feedback
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      
      console.log('✅ ProductCard: Successfully added to cart');
      
    } catch (error) {
      console.error('❌ ProductCard: Error adding to cart:', error);
      console.error('Error details:', error.stack);
      // Don't show alert - just log the error
      setAddedToCart(false);
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
