import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/products/ProductGrid';
import Filters from '../components/products/Filters';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [filters, setFilters] = useState({});

  const searchFilters = {
    q: query || '',
    ...filters
  };

  const { products, loading, pagination } = useProducts(searchFilters);

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>
          {query ? `Search Results for "${query}"` : 'All Products'}
          {pagination && !loading && <span> ({pagination.total} items)</span>}
        </h1>
        <Filters onFilterChange={setFilters} />
      </div>

      <ProductGrid products={products} loading={loading} />

      {!loading && products.length === 0 && (
        <div className="empty-state">
          <p>No products found matching your search.</p>
          <p>Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
