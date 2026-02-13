import { useState, useEffect } from 'react';
import { recommendationAPI } from '../../services/api';
import ProductCard from '../products/ProductCard';

function FrequentlyBought({ productId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      loadFrequentlyBought();
    }
  }, [productId]);

  const loadFrequentlyBought = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await recommendationAPI.getFrequentlyBought(productId);
      setProducts(response.products || []);
      setLoading(false);
    } catch (err) {
      console.error('Error loading frequently bought:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recommendation-section">
        <h2>🛍️ Frequently Bought Together</h2>
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
        <h2>🛍️ Frequently Bought Together</h2>
        <p className="recommendation-subtitle">
          Customers who bought this item also bought
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

export default FrequentlyBought;
