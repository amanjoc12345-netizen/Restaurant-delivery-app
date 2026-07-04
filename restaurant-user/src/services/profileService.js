import { firestoreApi, toFirestoreFields, fromFirestoreFields } from '../api/firebaseApi';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

export const profileService = {
  // Update customer's full name in the Firestore user profile
  updateProfileName: async (uid, newName, email, role, idToken) => {
    try {
      const payload = toFirestoreFields({
        fullName: newName,
        email,
        role: role || 'user',
        updatedAt: new Date().toISOString(),
      });
      
      const response = await firestoreApi.patch(
        `/users/${uid}?key=${apiKey}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      return fromFirestoreFields(response.data);
    } catch (error) {
      console.error(`Failed to update profile name for user ${uid}:`, error);
      throw error;
    }
  },
};
