import React, { createContext, useContext, useState, useEffect } from 'react';
import { authServices } from '../api/firebaseApi';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAdmin = async () => {
      const persistedToken = localStorage.getItem('restaurant_admin_token');
      if (persistedToken) {
        try {
          const userData = await authServices.getUserData(persistedToken);
          if (userData) {
            setAdmin({
              uid: userData.localId,
              email: userData.email,
              displayName: userData.displayName || 'Administrator',
            });
            setToken(persistedToken);
          } else {
            localStorage.removeItem('restaurant_admin_token');
          }
        } catch (error) {
          console.error('Admin auto-login failed:', error);
          localStorage.removeItem('restaurant_admin_token');
        }
      }
      setLoading(false);
    };

    initializeAdmin();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const authResult = await authServices.signIn(email, password);
      const { localId, idToken } = authResult;

      // Update state & storage
      localStorage.setItem('restaurant_admin_token', idToken);
      setToken(idToken);
      setAdmin({
        uid: localId,
        email,
        displayName: authResult.displayName || 'Administrator',
      });

      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      const message = error.response?.data?.error?.message || error.message || 'Invalid admin credentials';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('restaurant_admin_token');
    setToken(null);
    setAdmin(null);
  };

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
