// API Configuration
// This file centralizes the API base URL for all API calls

const getApiBaseUrl = () => {
  // Check if we're in development or production
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  
  // Production API URL
  return 'https://sawa-platform.vercel.app';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
};

export default API_BASE_URL;
