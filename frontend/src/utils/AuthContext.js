import React, { createContext, useContext, useState, useEffect } from 'react';
import { buildApiUrl } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    
    console.log('AuthContext useEffect - checking localStorage:', {
      hasToken: !!token,
      hasUserData: !!userData,
      token: token?.substring(0, 20) + '...',
      userData: userData
    });
    
    if (token && userData) {
      const user = JSON.parse(userData);
      setUser(user);
      setIsAuthenticated(true);
      console.log('Setting authenticated state to true, user:', user);
    } else {
      console.log('No valid token/userData found, remaining unauthenticated');
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const apiUrl = buildApiUrl('auth/login/');
      console.log('Login attempt - API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful, data:', data);
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        console.log('Stored in localStorage:', {
          accessToken: localStorage.getItem('accessToken'),
          userData: localStorage.getItem('userData')
        });
        
        setUser(data.user);
        setIsAuthenticated(true);
        console.log('Auth state updated - isAuthenticated:', true);
        return { success: true };
      } else {
        // try to capture JSON error, but fallback to text for 500s
        let errBody;
        try {
          errBody = await response.json();
        } catch (e) {
          try {
            errBody = await response.text();
          } catch (e2) {
            errBody = `Status ${response.status}`;
          }
        }
        console.error('Login failed:', response.status, errBody);
        console.error('Login failed - full response:', response);
        return { success: false, error: errBody.error || errBody || 'Login failed' };
      }
    } catch (error) {
      console.error('Login network error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(buildApiUrl('auth/register/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        return { success: true };
      } else {
        // try to capture JSON error, but fallback to text for 500s
        let errBody;
        try {
          errBody = await response.json();
        } catch (e) {
          try {
            errBody = await response.text();
          } catch (e2) {
            errBody = `Status ${response.status}`;
          }
        }
        console.error('Register failed:', response.status, errBody);
        return { success: false, error: errBody };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
