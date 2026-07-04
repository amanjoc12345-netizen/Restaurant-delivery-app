import { firestoreApi, toFirestoreFields, fromFirestoreFields } from '../api/firebaseApi';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

const SEED_CATEGORIES = [
  { id: 'cat-pizza', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=60' },
  { id: 'cat-burgers', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=60' },
  { id: 'cat-sushi', name: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=60' },
  { id: 'cat-desserts', name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop&q=60' },
  { id: 'cat-healthy', name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=60' },
];

export const categoryService = {
  // Fetch all food categories from Firestore
  getCategories: async () => {
    try {
      const response = await firestoreApi.get(`/categories?key=${apiKey}`);
      if (response.data && response.data.documents) {
        return response.data.documents.map(fromFirestoreFields);
      }
      // If categories is empty, trigger seeding
      return await categoryService.seedCategories();
    } catch (error) {
      // If collection doesn't exist, trigger seeding
      if (error.response && error.response.status === 404) {
        return await categoryService.seedCategories();
      }
      console.error('Failed to get categories:', error);
      throw error;
    }
  },

  // Seed categories to Firestore using REST patches
  seedCategories: async () => {
    console.log('Seeding categories...');
    const seededList = [];
    for (const cat of SEED_CATEGORIES) {
      try {
        const payload = toFirestoreFields({
          name: cat.name,
          image: cat.image,
        });
        const response = await firestoreApi.patch(`/categories/${cat.id}?key=${apiKey}`, payload);
        seededList.push(fromFirestoreFields(response.data));
      } catch (err) {
        console.error(`Failed to seed category ${cat.name}:`, err);
      }
    }
    return seededList.length > 0 ? seededList : SEED_CATEGORIES;
  },
};
