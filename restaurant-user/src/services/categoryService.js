import { firestoreApi, fromFirestoreFields } from '../api/firebaseApi';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

export const categoryService = {
  // Fetch all food categories from Firestore
  getCategories: async () => {
    try {
      const response = await firestoreApi.get(`/categories?key=${apiKey}`);
      if (response.data && response.data.documents) {
        return response.data.documents.map(fromFirestoreFields);
      }
      return [];
    } catch (error) {
      // If collection doesn't exist, return empty array
      if (error.response && error.response.status === 404) {
        return [];
      }
      console.error('Failed to get categories:', error);
      throw error;
    }
  },
};
