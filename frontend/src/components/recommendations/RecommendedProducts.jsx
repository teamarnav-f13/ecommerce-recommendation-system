import { useState, useEffect } from 'react';
import { recommendationAPI } from '../../services/api';
import ProductCard from '../products/ProductCard';

function RecommendedProducts({ userId, productId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [userId, productId]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - will be replaced with real API
      const mockRecommendations = [
        {
          product_id: 'REC-001',
          product_name: 'Recommended Product 1',
          category: 'Electronics',
          price: 59.99,
          popularity_score: 75,
          image_url: 'https://picsum.photos/seed/rec1/800/800',
          rating: 4.3,
          review_count: 123
        },
        {
          product_id: 'REC-002',
          product_name: 'Recommended Product 2',
          category: 'Electronics',
          price: 89.99,
          popularity_score: 82,
          image_url: 'https://picsum.photos/seed/rec2/800/800',
          rating: 4.5,
          review_count: 234
        },
        {
          product_id: 'REC-003',
          product_name: 'Recommended Product 3',
          category: 'Home & Garden',
          price: 39.99,
          popularity_score: 68,
          image_url: 'https://picsum.photos/seed/rec3/800/800',
          rating: 4.1,
          review_count: 87
        },
        {
          product_id: 'REC-004',
          product_name: 'Recommended Product 4',
          category: 'Sports',
          price: 69.99,
          popularity_score: 79,
          image_url: 'https://picsum.photos/seed/rec4/800/800',
          rating: 4.4,
          review_count: 156
        }
      ];

      setTimeout(() => {
        setRecommendations(mockRecommendations);
        setLoading(false);
      }, 500);

      // Uncomment when API is ready:
      // const response = await recommendationAPI.getRecommendations({
      //   user_id: userId,
      //   product_id: productId
      // });
      // setRecommendations(response.recommendations);
      // setLoading(false);
    } catch (error) {
      console.error('Error loading recommendations:', error);
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

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendation-section">
      <div className="recommendation-header">
        <h2>✨ Recommended For You</h2>
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