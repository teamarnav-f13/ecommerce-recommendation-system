import { useState, useEffect } from 'react';
import ProductCard from '../products/ProductCard';

function RecommendedProducts({ userId, productId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [userId, productId]);

  const fetchRecommendations = async () => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setRecommendations([
        {
          product_id: 'REC-001',
          product_name: 'Recommended Product 1',
          category: 'Electronics',
          price: 59.99,
          popularity_score: 75
        },
        {
          product_id: 'REC-002',
          product_name: 'Recommended Product 2',
          category: 'Electronics',
          price: 89.99,
          popularity_score: 82
        }
      ]);
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return <div className="loading-spinner">Loading recommendations...</div>;
  }

  return (
    <div className="recommendations-section">
      <div className="product-grid">
        {recommendations.map(product => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default RecommendedProducts;