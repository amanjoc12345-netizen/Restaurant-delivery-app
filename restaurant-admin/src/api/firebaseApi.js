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

// Axios instance for Firestore REST API
export const firestoreApi = axios.create({
  baseURL: `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper: Convert flat JavaScript object to Firestore REST API fields format
export const toFirestoreFields = (obj) => {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      fields[key] = { nullValue: null };
    } else if (typeof value === 'string') {
      fields[key] = { stringValue: value };
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        fields[key] = { integerValue: String(value) };
      } else {
        fields[key] = { doubleValue: value };
      }
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    } else {
      fields[key] = { stringValue: String(value) };
    }
  }
  return { fields };
};

// Helper: Convert Firestore REST API fields format to flat JavaScript object
export const fromFirestoreFields = (doc) => {
  if (!doc || !doc.fields) return null;
  const obj = {};
  for (const [key, valueObj] of Object.entries(doc.fields)) {
    if ('stringValue' in valueObj) {
      obj[key] = valueObj.stringValue;
    } else if ('integerValue' in valueObj) {
      obj[key] = parseInt(valueObj.integerValue, 10);
    } else if ('doubleValue' in valueObj) {
      obj[key] = parseFloat(valueObj.doubleValue);
    } else if ('booleanValue' in valueObj) {
      obj[key] = valueObj.booleanValue;
    } else if ('timestampValue' in valueObj) {
      obj[key] = valueObj.timestampValue;
    } else if ('nullValue' in valueObj) {
      obj[key] = null;
    } else {
      obj[key] = Object.values(valueObj)[0];
    }
  }
  if (doc.name) {
    const parts = doc.name.split('/');
    obj.id = parts[parts.length - 1];
  }
  return obj;
};

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

  changePassword: async (idToken, newPassword) => {
    const response = await authApi.post(`/accounts:update?key=${apiKey}`, {
      idToken,
      password: newPassword,
      returnSecureToken: true,
    });
    return response.data;
  },
};

