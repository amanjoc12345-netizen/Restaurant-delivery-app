import { firestoreApi, fromFirestoreFields } from '../api/firebaseApi';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

export const recipeService = {
  // Fetch all recipes
  getRecipes: async () => {
    try {
      const response = await firestoreApi.get(`/recipes?key=${apiKey}`);
      if (response.data && response.data.documents) {
        return response.data.documents.map(fromFirestoreFields);
      }
      return [];
    } catch (error) {
      // If collection doesn't exist, return empty array
      if (error.response && error.response.status === 404) {
        return [];
      }
      console.error('Failed to get recipes:', error);
      throw error;
    }
  },

  // Fetch single recipe by ID
  getRecipeById: async (id) => {
    try {
      const response = await firestoreApi.get(`/recipes/${id}?key=${apiKey}`);
      return fromFirestoreFields(response.data);
    } catch (error) {
      console.error(`Failed to get recipe with ID ${id}:`, error);
      throw error;
    }
  },

  // Fetch recipes by category
  getRecipesByCategory: async (categoryId) => {
    const allRecipes = await recipeService.getRecipes();
    return allRecipes.filter((r) => r.categoryId === categoryId);
  },
};
