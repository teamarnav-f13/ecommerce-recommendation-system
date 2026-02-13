import { useState, useEffect } from 'react';
import { recommendationAPI } from '../../services/api';
import ProductCard from '../products/ProductCard';

function SimilarProducts({ productId, category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId && category) {
      loadSimilarProducts();
    }
  }, [productId, category]);

  const loadSimilarProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await recommendationAPI.getSimilarProducts(productId, category);
      setProducts(response.products || []);
      setLoading(false);
    } catch (err) {
      console.error('Error loading similar products:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recommendation-section">
        <h2>🔍 Similar Products</h2>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !products || products.length === 0) {
    return null; // Don't show empty section
  }

  return (
    <div className="recommendation-section">
      <div className="recommendation-header">
        <h2>🔍 Similar Products</h2>
        <p className="recommendation-subtitle">
          You might also like these {category} products
        </p>
      </div>
      
      <div className="recommendation-grid">
        {products.map(product => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default SimilarProducts;
