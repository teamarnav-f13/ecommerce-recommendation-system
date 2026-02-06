import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const { 
    product_id, 
    product_name, 
    price, 
    category, 
    popularity_score,
    image_url 
  } = product;

  const rating = Math.min(5, Math.floor((popularity_score || 50) / 20));

  return (
    <div className="product-card">
      <Link to={`/product/${product_id}`} className="product-image-link">
        <div className="product-image">
          <img 
            src={image_url || `https://picsum.photos/seed/${product_id}/400/400`} 
            alt={product_name}
          />
          <button className="wishlist-button">
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
              fill={i < rating ? '#fbbf24' : 'none'}
              stroke={i < rating ? '#fbbf24' : '#d1d5db'}
            />
          ))}
          <span className="rating-count">({popularity_score || 0})</span>
        </div>

        <div className="product-footer">
          <span className="product-price">${price.toFixed(2)}</span>
          <button className="add-to-cart-button">
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;