import { firestoreApi, toFirestoreFields, fromFirestoreFields } from '../api/firebaseApi';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

export const recipeService = {
  getRecipes: async () => {
    try {
      const response = await firestoreApi.get(`/recipes?key=${apiKey}`);
      if (response.data && response.data.documents) {
        return response.data.documents.map(fromFirestoreFields);
      }
      return [];
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      console.error('Failed to fetch recipes:', error);
      throw error;
    }
  },

  createRecipe: async (recipeData, idToken) => {
    try {
      const payload = toFirestoreFields({
        ...recipeData,
        price: parseFloat(recipeData.price),
        createdAt: new Date().toISOString(),
      });
      const response = await firestoreApi.post(`/recipes?key=${apiKey}`, payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return fromFirestoreFields(response.data);
    } catch (error) {
      console.error('Failed to create recipe:', error);
      throw error;
    }
  },

  updateRecipe: async (id, recipeData, idToken) => {
    try {
      const { id: _, ...dataToUpdate } = recipeData;
      const payload = toFirestoreFields({
        ...dataToUpdate,
        price: parseFloat(dataToUpdate.price),
      });
      const response = await firestoreApi.patch(`/recipes/${id}?key=${apiKey}`, payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return fromFirestoreFields(response.data);
    } catch (error) {
      console.error(`Failed to update recipe ${id}:`, error);
      throw error;
    }
  },

  deleteRecipe: async (id, idToken) => {
    try {
      await firestoreApi.delete(`/recipes/${id}?key=${apiKey}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete recipe ${id}:`, error);
      throw error;
    }
  },
};
