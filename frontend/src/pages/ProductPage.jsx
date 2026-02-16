import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, Shield, ArrowLeft, Share2 } from 'lucide-react';
import { productAPI, activityAPI } from '../services/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import FrequentlyBought from '../components/recommendations/FrequentlyBought';
import SimilarProducts from '../components/recommendations/SimilarProducts';

function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  // Log product view when product loads
  useEffect(() => {
    if (product && productId) {
      logProductView();
    }
  }, [product, productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProduct(productId);
      setProduct(response.product);
      setLoading(false);
    } catch (err) {
      console.error('Error loading product:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const logProductView = async () => {
    try {
      const session = await fetchAuthSession();
      const userId = session.tokens?.idToken?.payload?.sub;
    
      if (userId && productId) {
        await activityAPI.logView(productId, userId);
        console.log('✅ Product view logged to DynamoDB');
      }
    } catch (error) {
      console.error('Error logging view:', error);
      // Don't block user experience if logging fails
    }
  };

  const handleAddToCart = async () => {
    try {
      console.log('Adding to cart...', product);

      // Get user ID for activity logging
      let userId = null;
      try {
        const session = await fetchAuthSession();
        userId = session.tokens?.idToken?.payload?.sub;
      } catch (authError) {
        console.log('Not authenticated, skipping activity log');
      }

      // Log add to cart activity to DynamoDB
      if (userId && productId) {
        await activityAPI.logAddToCart(productId, userId, quantity);
        console.log('✅ Add to cart logged to DynamoDB');
      }

      // Safely get product image
      let productImage = product.image_url || `https://picsum.photos/seed/${productId}/800/800`;
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        productImage = product.images[0];
      }

      // Create cart item
      const cartItem = {
        id: `CART-${Date.now()}`,
        product_id: product.product_id,
        product_name: product.product_name,
        price: product.price,
        quantity: quantity,
        image_url: productImage,
        vendor_name: product.vendor_name || 'ShopSmart',
        stock_quantity: product.stock_quantity || 100
      };

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

      // Check if product already in cart
      const existingIndex = currentCart.findIndex(item => item.product_id === product.product_id);

      if (existingIndex >= 0) {
        // Update quantity of existing item
        currentCart[existingIndex].quantity += quantity;
        console.log('Updated existing cart item');
      } else {
        // Add new item to cart
        currentCart.push(cartItem);
        console.log('Added new item to cart');
      }

      // Save updated cart to localStorage
      localStorage.setItem('shopping_cart', JSON.stringify(currentCart));
      console.log('Cart saved to localStorage');

      // Trigger cart update event for header
      window.dispatchEvent(new Event('cart-updated'));

      // Show success feedback
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);

      console.log('✅ Product added to cart successfully');

    } catch (err) {
      console.error('❌ Error adding to cart:', err);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log('Wishlist toggled:', !isWishlisted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.product_name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>⚠️ Product Not Found</h2>
        <p>{error || 'This product does not exist'}</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const {
    product_name,
    description,
    price,
    original_price,
    discount_percentage,
    category,
    brand,
    rating,
    review_count,
    stock_quantity,
    image_url,
    vendor_name,
    is_featured,
    is_bestseller
  } = product;

  // Use images from product data if available
  const images = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [
        image_url || `https://picsum.photos/seed/${productId}/800/800`,
        `https://picsum.photos/seed/${productId}-2/800/800`,
        `https://picsum.photos/seed/${productId}-3/800/800`,
        `https://picsum.photos/seed/${productId}-4/800/800`
      ];

  const inStock = stock_quantity > 0;
  const lowStock = stock_quantity < 10;

  return (
    <div className="product-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button onClick={() => navigate('/')} className="breadcrumb-link">
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>
        <span className="breadcrumb-separator">/</span>
        <button onClick={() => navigate(`/search?category=${category}`)} className="breadcrumb-link">
          {category}
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product_name}</span>
      </div>

      <div className="product-detail-container">
        {/* Left: Image Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img src={images[selectedImage]} alt={product_name} />
            {discount_percentage > 0 && (
              <div className="discount-badge">
                -{discount_percentage}% OFF
              </div>
            )}
            {is_featured && (
              <div className="featured-badge">
                ⭐ Featured
              </div>
            )}
            {is_bestseller && (
              <div className="bestseller-badge">
                🏆 Bestseller
              </div>
            )}
          </div>

          <div className="image-thumbnails">
            {images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`${product_name} view ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="product-info-section">
          {/* Product Title */}
          <div className="product-header">
            <div>
              <span className="product-brand">{brand}</span>
              <h1 className="product-title">{product_name}</h1>
            </div>
            <div className="product-actions">
              <button 
                className={`icon-button ${isWishlisted ? 'active' : ''}`}
                onClick={handleWishlist}
              >
                <Heart size={24} fill={isWishlisted ? '#ef4444' : 'none'} />
              </button>
              <button className="icon-button" onClick={handleShare}>
                <Share2 size={24} />
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="product-rating-section">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.floor(rating) ? '#fbbf24' : 'none'}
                  stroke={i < Math.floor(rating) ? '#fbbf24' : '#d1d5db'}
                />
              ))}
              <span className="rating-value">{rating}</span>
            </div>
            <span className="review-count">({review_count?.toLocaleString() || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="product-pricing">
            <div className="price-main">${price.toFixed(2)}</div>
            {original_price > price && (
              <>
                <div className="price-original">${original_price.toFixed(2)}</div>
                <div className="price-save">
                  Save ${(original_price - price).toFixed(2)} ({discount_percentage}%)
                </div>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="stock-status">
            {inStock ? (
              <>
                <span className={`stock-badge ${lowStock ? 'low' : 'in-stock'}`}>
                  {lowStock ? '⚠️ Only a few left' : '✓ In Stock'}
                </span>
                <span className="stock-count">
                  {stock_quantity} available
                </span>
              </>
            ) : (
              <span className="stock-badge out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="product-description">
            <h3>About this product</h3>
            <p>{description}</p>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <h3>Product Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{category}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Brand:</span>
                <span className="detail-value">{brand}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sold by:</span>
                <span className="detail-value">{vendor_name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Product ID:</span>
                <span className="detail-value">{productId}</span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                className="quantity-input"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={stock_quantity}
              />
              <button
                className="quantity-btn"
                onClick={() => setQuantity(Math.min(stock_quantity, quantity + 1))}
                disabled={quantity >= stock_quantity}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="product-actions-buttons">
            <button
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={!inStock || addedToCart}
            >
              <ShoppingCart size={20} />
              <span>{addedToCart ? 'Added to Cart!' : 'Add to Cart'}</span>
            </button>
            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={!inStock}
            >
              Buy Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-badge">
              <Truck size={20} />
              <div>
                <strong>Free Delivery</strong>
                <span>On orders over $50</span>
              </div>
            </div>
            <div className="trust-badge">
              <Shield size={20} />
              <div>
                <strong>Secure Payment</strong>
                <span>100% secure transactions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations-section">
        <FrequentlyBought productId={productId} />
        <SimilarProducts productId={productId} category={category} />
      </div>
    </div>
  );
}

export default ProductPage;
