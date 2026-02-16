import { useState, useEffect } from 'react';
import { recommendationAPI } from '../../services/api';
import ProductCard from '../products/ProductCard';

function RecommendedProducts({ userId, productId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId || productId) {
      loadRecommendations();
    }
  }, [userId, productId]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build params - only include defined values
      const params = {};
      if (userId) params.user_id = userId;
      if (productId) params.product_id = productId;
      params.limit = 8;
      
      console.log('Loading recommendations with params:', params);
      
      const response = await recommendationAPI.getRecommendations(params);
      
      console.log('Recommendations response:', response);
      
      setRecommendations(response.recommendations || []);
      setLoading(false);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        Loading recommendations...
      </div>
    );
  }

  if (error) {
    console.error('Recommendation error:', error);
    return null; // Don't show error to user
  }

  if (!recommendations || recommendations.length === 0) {
    console.log('No recommendations available');
    return null; // Don't show empty section
  }

  return (
    <div className="recommendation-section">
      <div className="recommendation-header">
        <h2>Recommended For You</h2>
        <p className="recommendation-subtitle">
          Based on your browsing and purchase history
        </p>
      </div>
      
      <div className="recommendation-grid">
        {recommendations.map(product => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default RecommendedProducts;
