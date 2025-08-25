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
      const response = await fetch(buildApiUrl('auth/login/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

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
        const error = await response.json();
        return { success: false, error: error.error || 'Login failed' };
      }
    } catch (error) {
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
        const error = await response.json();
        return { success: false, error };
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
