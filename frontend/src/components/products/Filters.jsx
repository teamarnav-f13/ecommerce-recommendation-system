import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

function Filters({ onFilterChange }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'popularity'
  });

  // Categories from your DynamoDB data
  const categories = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Toys & Games',
    'Health & Beauty',
    'Automotive'
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'popularity'
    };
    setFilters(clearedFilters);
    onFilterChange({});
  };

  return (
    <div className="filters-container">
      <button 
        className="filters-toggle"
        onClick={() => setShowFilters(!showFilters)}
      >
        <SlidersHorizontal size={20} />
        <span>Filters</span>
      </button>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'All Categories' ? 'all' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <button 
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Filters;
