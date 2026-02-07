import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import Filters from '../components/products/Filters';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // TODO: Replace with actual API call
    searchProducts(query, filters);
  }, [query, filters]);

  const searchProducts = async (searchQuery, filterParams) => {
    setLoading(true);
    // Mock implementation
    setTimeout(() => {
      setProducts([
        {
          product_id: 'PROD-005',
          product_name: `Product matching "${searchQuery}"`,
          category: 'Electronics',
          price: 149.99,
          popularity_score: 70
        }
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>Search Results for "{query}"</h1>
        <Filters onFilterChange={setFilters} />
      </div>

      <ProductGrid products={products} loading={loading} />
    </div>
  );
}

export default SearchResults;