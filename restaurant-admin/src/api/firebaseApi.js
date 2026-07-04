import axios from 'axios';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Axios instance for Firebase Authentication REST API
export const authApi = axios.create({
  baseURL: 'https://identitytoolkit.googleapis.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication REST Methods
export const authServices = {
  signIn: async (email, password) => {
    const response = await authApi.post(`/accounts:signInWithPassword?key=${apiKey}`, {
      email,
      password,
      returnSecureToken: true,
    });
    return response.data;
  },

  getUserData: async (idToken) => {
    const response = await authApi.post(`/accounts:lookup?key=${apiKey}`, {
      idToken,
    });
    return response.data.users?.[0] || null;
  },
};
