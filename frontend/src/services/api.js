import { fetchAuthSession } from 'aws-amplify/auth';

// API Gateway base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://b6yga2ffv8.execute-api.ap-south-1.amazonaws.com/prod';

// Helper function for API requests
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
      const errorText = await response.text();
      console.error(`❌ API Error ${response.status}:`, errorText);
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

// Helper to get session ID (persisted in sessionStorage)
function getSessionId() {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

// Product API endpoints
export const productAPI = {
  /**
   * Search products
   * @param {Object} params - Search parameters
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
    try {
      const response = await fetch(`${API_BASE_URL}/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          event_type: 'view',
          session_id: getSessionId()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to log view: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ View logged:', data);
      return data;
    } catch (error) {
      console.error('❌ Error logging view:', error);
      // Don't throw - activity logging failure shouldn't break the app
      return null;
    }
  },

  /**
   * Log add to cart event
   * @param {string} productId - Product ID
   * @param {string} userId - User ID
   * @param {number} quantity - Quantity added
   */
  logAddToCart: async (productId, userId, quantity = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          event_type: 'add_to_cart',
          quantity: quantity,
          session_id: getSessionId()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to log add to cart: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Add to cart logged:', data);
      return data;
    } catch (error) {
      console.error('❌ Error logging add to cart:', error);
      return null;
    }
  },

  /**
   * Log purchase event
   * @param {string} productId - Product ID
   * @param {string} userId - User ID
   * @param {number} quantity - Quantity purchased
   * @param {string} orderId - Order ID
   */
  logPurchase: async (productId, userId, quantity, orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          event_type: 'purchase',
          quantity: quantity,
          order_id: orderId,
          session_id: getSessionId()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to log purchase: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Purchase logged:', data);
      return data;
    } catch (error) {
      console.error('❌ Error logging purchase:', error);
      return null;
    }
  }
};

// Recommendation API endpoints
export const recommendationAPI = {
  /**
   * Get general recommendations
   * @param {Object} params - Query parameters
   */
  getRecommendations: async (params = {}) => {
    // Filter out undefined values
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== 'undefined') {
        cleanParams[key] = params[key];
      }
    });
    
    const queryString = new URLSearchParams(cleanParams).toString();
    console.log('📡 Recommendation query:', queryString);
    
    try {
      const response = await apiRequest(`/recommendations?${queryString}`);
      return response;
    } catch (error) {
      console.error('❌ Recommendation API error:', error);
      // Return empty array instead of throwing
      return { recommendations: [], count: 0 };
    }
  },

  /**
   * Get frequently bought together products
   * @param {string} productId - Product ID
   */
  getFrequentlyBought: async (productId) => {
    if (!productId || productId === 'undefined') {
      console.warn('Invalid product ID for frequently bought');
      return { recommendations: [] };
    }
    return apiRequest(`/recommendations?product_id=${productId}&type=frequently-bought&limit=4`);
  },

  /**
   * Get similar products (category-based)
   * @param {string} productId - Product ID
   */
  getSimilarProducts: async (productId) => {
    if (!productId || productId === 'undefined') {
      console.warn('Invalid product ID for similar products');
      return { recommendations: [] };
    }
    return apiRequest(`/recommendations?product_id=${productId}&type=similar&limit=8`);
  },

  /**
   * Get users also viewed products
   * @param {string} productId - Product ID
   */
  getUsersAlsoViewed: async (productId) => {
    if (!productId || productId === 'undefined') {
      console.warn('Invalid product ID for also viewed');
      return { recommendations: [] };
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
