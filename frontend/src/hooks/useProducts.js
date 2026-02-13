import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [JSON.stringify(params)]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productAPI.search(params);
      
      setProducts(response.products);
      setPagination(response.pagination);
      setLoading(false);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const refetch = () => {
    loadProducts();
  };

  return { products, loading, error, pagination, refetch };
}

export function useFeaturedProducts(limit = 12) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatured();
  }, [limit]);

  const loadFeatured = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getFeatured(limit);
      setProducts(response.products);
      setLoading(false);
    } catch (error) {
      console.error('Error loading featured products:', error);
      setLoading(false);
    }
  };

  return { products, loading };
}
