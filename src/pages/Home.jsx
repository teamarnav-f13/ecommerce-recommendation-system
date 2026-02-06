import { useState, useEffect } from 'react';
import ProductGrid from '../components/products/ProductGrid';
import RecommendedProducts from '../components/recommendations/RecommendedProducts';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - will be replaced with API call
    setTimeout(() => {
      setFeaturedProducts([
        {
          product_id: 'PROD-001',
          product_name: 'Wireless Headphones',
          category: 'Electronics',
          price: 99.99,
          popularity_score: 85
        },
        {
          product_id: 'PROD-002',
          product_name: 'Smart Watch',
          category: 'Electronics',
          price: 299.99,
          popularity_score: 92
        },
        {
          product_id: 'PROD-003',
          product_name: 'Running Shoes',
          category: 'Sports',
          price: 79.99,
          popularity_score: 78
        },
        {
          product_id: 'PROD-004',
          product_name: 'Coffee Maker',
          category: 'Home & Garden',
          price: 49.99,
          popularity_score: 65
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Products You'll Love</h1>
          <p>AI-powered recommendations tailored just for you</p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <h2 className="section-title">Featured Products</h2>
        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Recommended Section */}
      <section className="section">
        <h2 className="section-title">Recommended For You</h2>
        <RecommendedProducts userId="current-user" />
      </section>
    </div>
  );
}

export default Home;