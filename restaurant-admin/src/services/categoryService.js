import { firestoreApi, toFirestoreFields, fromFirestoreFields } from '../api/firebaseApi';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

export const categoryService = {
  getCategories: async () => {
    try {
      const response = await firestoreApi.get(`/categories?key=${apiKey}`);
      if (response.data && response.data.documents) {
        return response.data.documents.map(fromFirestoreFields);
      }
      return [];
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  createCategory: async (categoryData, idToken) => {
    try {
      const payload = toFirestoreFields({
        ...categoryData,
        createdAt: new Date().toISOString(),
      });
      const response = await firestoreApi.post(`/categories?key=${apiKey}`, payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return fromFirestoreFields(response.data);
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  },

  updateCategory: async (id, categoryData, idToken) => {
    try {
      const { id: _, ...dataToUpdate } = categoryData;
      const payload = toFirestoreFields(dataToUpdate);
      const response = await firestoreApi.patch(`/categories/${id}?key=${apiKey}`, payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return fromFirestoreFields(response.data);
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error);
      throw error;
    }
  },

  deleteCategory: async (id, idToken) => {
    try {
      await firestoreApi.delete(`/categories/${id}?key=${apiKey}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, error);
      throw error;
    }
  },
};
