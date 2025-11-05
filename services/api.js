import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CHANGE THIS TO YOUR BACKEND URL
const API_URL = 'https://7925379a5a3c.ngrok-free.app/api/v1'; // Change to your deployed URL in production
// For testing on device: 'http://YOUR_COMPUTER_IP:5000/api/v1'
// For production: 'https://your-backend.herokuapp.com/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      // Navigate to login screen (you'll need to implement this)
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        // Save token and user data
        await AsyncStorage.setItem('authToken', response.data.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        await AsyncStorage.setItem('authToken', response.data.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  // Get current user
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get user data' };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Request failed' };
    }
  },

  // Reset password
  resetPassword: async (resetToken, newPassword) => {
    try {
      const response = await api.put(`/auth/reset-password/${resetToken}`, { 
        password: newPassword 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Reset failed' };
    }
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/update-password', {
        currentPassword,
        newPassword
      });
      if (response.data.success) {
        await AsyncStorage.setItem('authToken', response.data.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Update failed' };
    }
  },

  // Set skill level (from onboarding)
  setSkillLevel: async (skillLevel) => {
    try {
      const response = await api.put('/auth/set-skill-level', { skillLevel });
      if (response.data.success) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to set skill level' };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      // Still remove local data even if API call fails
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    }
  }
};

// User APIs
export const userAPI = {
  // Get profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get profile' };
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Update failed' };
    }
  },

  // Update skill level
  updateSkillLevel: async (skillLevel) => {
    try {
      const response = await api.put('/user/skill-level', { skillLevel });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Update failed' };
    }
  },

  // Get subscription status
  getSubscriptionStatus: async () => {
    try {
      const response = await api.get('/user/subscription');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get subscription' };
    }
  }
};

// Chat APIs
export const chatAPI = {
  // Create chat session
  createSession: async (title = 'New Conversation') => {
    try {
      const response = await api.post('/chat/session', { title });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create session' };
    }
  },

  // Add message to chat
  addMessage: async (sessionId, message) => {
    try {
      const response = await api.post(`/chat/${sessionId}/message`, message);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to add message' };
    }
  },

  // Get all chat sessions
  getSessions: async (limit = 50, skip = 0) => {
    try {
      const response = await api.get(`/chat/sessions?limit=${limit}&skip=${skip}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get sessions' };
    }
  },

  // Get specific conversation
  getConversation: async (sessionId) => {
    try {
      const response = await api.get(`/chat/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get conversation' };
    }
  },

  // Update chat title
  updateTitle: async (sessionId, title) => {
    try {
      const response = await api.put(`/chat/${sessionId}/title`, { title });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update title' };
    }
  },

  // Archive chat
  archiveChat: async (sessionId, archived = true) => {
    try {
      const response = await api.put(`/chat/${sessionId}/archive`, { archived });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to archive chat' };
    }
  },

  // Delete chat session
  deleteSession: async (sessionId) => {
    try {
      const response = await api.delete(`/chat/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete session' };
    }
  },

  // Search chat history
  searchHistory: async (query, limit = 20) => {
    try {
      const response = await api.get(`/chat/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Search failed' };
    }
  },
  sendMessageToAI: async (messageData) => {
    try {
      const response = await api.post('/chat/send-message', messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to send message' };
    }
  }
};

// Payment APIs
export const paymentAPI = {
  // Create checkout session
  createCheckoutSession: async () => {
    try {
      const response = await api.post('/payment/create-checkout-session');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create checkout' };
    }
  },

  // Get subscription
  getSubscription: async () => {
    try {
      const response = await api.get('/payment/subscription');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get subscription' };
    }
  },

  // Create portal session
  createPortalSession: async () => {
    try {
      const response = await api.post('/payment/create-portal-session');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create portal session' };
    }
  },

  // Cancel subscription
  cancelSubscription: async () => {
    try {
      const response = await api.post('/payment/cancel-subscription');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to cancel subscription' };
    }
  },

  // Reactivate subscription
  reactivateSubscription: async () => {
    try {
      const response = await api.post('/payment/reactivate-subscription');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to reactivate subscription' };
    }
  }
};

export default api;