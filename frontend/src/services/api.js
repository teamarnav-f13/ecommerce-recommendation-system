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

export const recommendationAPI = {
  // General recommendations
  getRecommendations: async (params = {}) => {
    // Filter out undefined values
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== 'undefined') {
        cleanParams[key] = params[key];
      }
    });
    
    const queryString = new URLSearchParams(cleanParams).toString();
    console.log('Recommendation API query:', queryString);
    return apiRequest(`/recommendations?${queryString}`);
  },

  // Frequently bought together
  getFrequentlyBought: async (productId) => {
    if (!productId || productId === 'undefined') {
      console.warn('Invalid product ID for frequently bought');
      return { products: [] };
    }
    return apiRequest(`/recommendations?product_id=${productId}&type=frequently-bought&limit=4`);
  },

  // Similar products (category-based)
  getSimilarProducts: async (productId, category) => {
    if (!productId || productId === 'undefined') {
      console.warn('Invalid product ID for similar products');
      return { products: [] };
    }
    return apiRequest(`/recommendations?product_id=${productId}&type=similar&limit=8`);
  },

  // Users also viewed
  getUsersAlsoViewed: async (productId) => {
    if (!productId || productId === 'undefined') {
      console.warn('Invalid product ID for also viewed');
      return { products: [] };
    }
    return apiRequest(`/recommendations?product_id=${productId}&type=also-viewed&limit=6`);
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
