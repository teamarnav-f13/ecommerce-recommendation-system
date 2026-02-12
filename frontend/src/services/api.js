import { fetchAuthSession } from 'aws-amplify/auth';

// Replace with your actual API Gateway URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://b6yga2ffv8.execute-api.ap-south-1.amazonaws.com/prod';

async function apiRequest(endpoint, options = {}) {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    const config = {
      ...options,
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    console.log('🔗 API Request:', `${API_BASE_URL}${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Response:', data);
    return data;
  } catch (error) {
    console.error('❌ API Request failed:', error);
    throw error;
  }
}

// Product API endpoints
export const productAPI = {
  /**
   * Search products
   * @param {Object} params - Search parameters (q, category, minPrice, maxPrice, vendor, sortBy, page, limit)
   */
  search: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/search?${queryString}`);
  },

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   */
  getProduct: async (productId) => {
    return apiRequest(`/products/${productId}`);
  },

  /**
   * Get featured products
   * @param {number} limit - Number of products to return
   */
  getFeatured: async (limit = 12) => {
    return apiRequest(`/featured?limit=${limit}`);
  }
};

// Activity tracking API endpoints
export const activityAPI = {
  /**
   * Log product view
   * @param {string} productId - Product ID
   * @param {string} userId - User ID
   */
  logView: async (productId, userId) => {
    return apiRequest('/activity/view', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        user_id: userId,
        event_type: 'view',
        timestamp: new Date().toISOString()
      })
    });
  },

  /**
   * Log add to cart event
   * @param {string} productId - Product ID
   * @param {string} userId - User ID
   */
  logAddToCart: async (productId, userId) => {
    return apiRequest('/activity/cart', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        user_id: userId,
        event_type: 'add_to_cart',
        timestamp: new Date().toISOString()
      })
    });
  },

  /**
   * Log purchase event
   * @param {string} productId - Product ID
   * @param {string} userId - User ID
   * @param {number} quantity - Quantity purchased
   */
  logPurchase: async (productId, userId, quantity = 1) => {
    return apiRequest('/activity/purchase', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        user_id: userId,
        event_type: 'purchase',
        quantity: quantity,
        timestamp: new Date().toISOString()
      })
    });
  }
};

// Recommendation API endpoints
export const recommendationAPI = {
  /**
   * Get recommendations for a user/product
   * @param {Object} params - { user_id, product_id, type }
   */
  getRecommendations: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/recommendations?${queryString}`);
  },

  /**
   * Get frequently bought together products
   * @param {string} productId - Product ID
   */
  getFrequentlyBought: async (productId) => {
    return apiRequest(`/recommendations/frequently-bought?product_id=${productId}`);
  },

  /**
   * Get similar products
   * @param {string} productId - Product ID
   * @param {string} category - Category
   */
  getSimilarProducts: async (productId, category) => {
    return apiRequest(`/recommendations/similar?product_id=${productId}&category=${category}`);
  },

  /**
   * Get users also viewed
   * @param {string} productId - Product ID
   */
  getUsersAlsoViewed: async (productId) => {
    return apiRequest(`/recommendations/also-viewed?product_id=${productId}`);
  }
};

// Helper to get current user ID
export async function getCurrentUserId() {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.payload?.sub;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

export default {
  productAPI,
  activityAPI,
  recommendationAPI,
  getCurrentUserId
};
