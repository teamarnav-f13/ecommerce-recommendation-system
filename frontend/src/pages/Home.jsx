import { useFeaturedProducts } from '../hooks/useProducts';
import ProductGrid from '../components/products/ProductGrid';
import RecommendedProducts from '../components/recommendations/RecommendedProducts';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useState, useEffect } from 'react';

function Home() {
  const { products: featuredProducts, loading } = useFeaturedProducts(12);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    try {
      const session = await fetchAuthSession();
      const uid = session.tokens?.idToken?.payload?.sub;
      setUserId(uid);
    } catch (error) {
      console.log('Not authenticated');
    }
  }

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

      {/* Recommended Section - Only show if user is logged in */}
      {userId && (
        <section className="section">
          <h2 className="section-title">Recommended For You</h2>
          <RecommendedProducts userId={userId} />
        </section>
      )}
    </div>
  );
}

export default Home;
