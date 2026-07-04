import React, { createContext, useContext, useState, useEffect } from 'react';
import { authServices, firestoreServices } from '../api/firebaseApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check persistent token
  useEffect(() => {
    const initializeAuth = async () => {
      const persistedToken = localStorage.getItem('restaurant_user_token');
      if (persistedToken) {
        try {
          // Verify token and get user uid
          const userData = await authServices.getUserData(persistedToken);
          if (userData) {
            // Load Firestore user profile
            const profile = await firestoreServices.getUserProfile(userData.localId, persistedToken);
            
            setUser({
              uid: userData.localId,
              email: userData.email,
              emailVerified: userData.emailVerified,
              ...profile,
            });
            setToken(persistedToken);
          } else {
            // Invalid token
            localStorage.removeItem('restaurant_user_token');
          }
        } catch (error) {
          console.error('Auto-login session restoration failed:', error);
          localStorage.removeItem('restaurant_user_token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signup = async (email, password, fullName) => {
    setLoading(true);
    try {
      // 1. Create authentication record
      const authResult = await authServices.signUp(email, password);
      const { localId, idToken } = authResult;

      // 2. Create profile inside Firestore
      const profileData = {
        fullName,
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      
      const savedProfile = await firestoreServices.setUserProfile(localId, profileData, idToken);

      // 3. Update local state & storage
      localStorage.setItem('restaurant_user_token', idToken);
      setToken(idToken);
      setUser({
        uid: localId,
        email,
        ...savedProfile,
      });

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      const message = error.response?.data?.error?.message || error.message || 'An error occurred during signup';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1. Sign in with password
      const authResult = await authServices.signIn(email, password);
      const { localId, idToken } = authResult;

      // 2. Get profile from Firestore
      let profile = await firestoreServices.getUserProfile(localId, idToken);
      
      // Fallback in case firestore write failed during signup or admin created account
      if (!profile) {
        profile = {
          fullName: authResult.displayName || email.split('@')[0],
          email,
          role: 'user',
        };
        await firestoreServices.setUserProfile(localId, profile, idToken);
      }

      // 3. Update state & storage
      localStorage.setItem('restaurant_user_token', idToken);
      setToken(idToken);
      setUser({
        uid: localId,
        email,
        ...profile,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.error?.message || error.message || 'Invalid email or password';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authServices.sendPasswordReset(email);
      return { success: true };
    } catch (error) {
      console.error('Password reset request error:', error);
      const message = error.response?.data?.error?.message || error.message || 'Unable to send password reset email';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('restaurant_user_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedProfile) => {
    setUser((prev) => (prev ? { ...prev, ...updatedProfile } : null));
  };

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    forgotPassword,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
