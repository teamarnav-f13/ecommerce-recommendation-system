import { useState, useEffect } from 'react';
import { recommendationAPI } from '../../services/api';
import ProductCard from '../products/ProductCard';

function SimilarProducts({ productId, category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId && category) {
      loadSimilarProducts();
    }
  }, [productId, category]);

  const loadSimilarProducts = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - will be replaced with real API
      const mockProducts = [
        {
          product_id: 'SIM-001',
          product_name: 'Similar Product 1',
          category: category,
          price: 89.99,
          popularity_score: 78,
          image_url: 'https://picsum.photos/seed/sim1/800/800',
          rating: 4.4,
          review_count: 167
        },
        {
          product_id: 'SIM-002',
          product_name: 'Similar Product 2',
          category: category,
          price: 119.99,
          popularity_score: 85,
          image_url: 'https://picsum.photos/seed/sim2/800/800',
          rating: 4.6,
          review_count: 289
        },
        {
          product_id: 'SIM-003',
          product_name: 'Similar Product 3',
          category: category,
          price: 79.99,
          popularity_score: 71,
          image_url: 'https://picsum.photos/seed/sim3/800/800',
          rating: 4.2,
          review_count: 134
        },
        {
          product_id: 'SIM-004',
          product_name: 'Similar Product 4',
          category: category,
          price: 99.99,
          popularity_score: 80,
          image_url: 'https://picsum.photos/seed/sim4/800/800',
          rating: 4.5,
          review_count: 201
        }
      ];

      setTimeout(() => {
        setProducts(mockProducts);
        setLoading(false);
      }, 600);

      // Uncomment when API is ready:
      // const response = await recommendationAPI.getSimilarProducts(productId, category);
      // setProducts(response.products);
      // setLoading(false);
    } catch (error) {
      console.error('Error loading similar products:', error);
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

  if (!products || products.length === 0) {
    return null;
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