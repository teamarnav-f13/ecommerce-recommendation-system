import { useState, useEffect } from 'react';
import { recommendationAPI } from '../../services/api';
import ProductCard from '../products/ProductCard';

function FrequentlyBought({ productId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      loadFrequentlyBought();
    }
  }, [productId]);

  const loadFrequentlyBought = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - will be replaced with real API
      const mockProducts = [
        {
          product_id: 'FREQ-001',
          product_name: 'Wireless Mouse',
          category: 'Electronics',
          price: 29.99,
          popularity_score: 75,
          image_url: 'https://picsum.photos/seed/freq1/800/800',
          rating: 4.3,
          review_count: 145
        },
        {
          product_id: 'FREQ-002',
          product_name: 'USB-C Cable',
          category: 'Electronics',
          price: 12.99,
          popularity_score: 82,
          image_url: 'https://picsum.photos/seed/freq2/800/800',
          rating: 4.5,
          review_count: 234
        },
        {
          product_id: 'FREQ-003',
          product_name: 'Laptop Stand',
          category: 'Electronics',
          price: 45.99,
          popularity_score: 68,
          image_url: 'https://picsum.photos/seed/freq3/800/800',
          rating: 4.2,
          review_count: 89
        }
      ];

      setTimeout(() => {
        setProducts(mockProducts);
        setLoading(false);
      }, 500);

      // Uncomment when API is ready:
      // const response = await recommendationAPI.getFrequentlyBought(productId);
      // setProducts(response.products);
      // setLoading(false);
    } catch (error) {
      console.error('Error loading frequently bought products:', error);
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

  if (!products || products.length === 0) {
    return null;
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