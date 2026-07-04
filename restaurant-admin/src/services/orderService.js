import { firestoreApi, toFirestoreFields, fromFirestoreFields } from '../api/firebaseApi';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

export const orderService = {
  // Fetch all orders from Firestore (admin view)
  getOrders: async (idToken) => {
    try {
      const response = await firestoreApi.get(`/orders?key=${apiKey}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.data && response.data.documents) {
        return response.data.documents.map((doc) => {
          const order = fromFirestoreFields(doc);
          let items = [];
          if (order.itemsJson) {
            try {
              items = JSON.parse(order.itemsJson);
            } catch (e) {
              console.error('Failed to parse items json for order:', order.id);
            }
          }
          return {
            ...order,
            items,
          };
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      return [];
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },

  // Update status of an order (e.g. Pending -> Preparing -> Out for Delivery -> Delivered)
  updateOrderStatus: async (id, status, idToken) => {
    try {
      const payload = toFirestoreFields({ status });
      // We perform a patch to only update the status field in the document
      // Note: By default, patch in Firestore REST API updates specific fields. We can pass updateMask in query params to ensure only that field is updated.
      // E.g., `updateMask.fieldPaths=status`
      const response = await firestoreApi.patch(
        `/orders/${id}?updateMask.fieldPaths=status&key=${apiKey}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      return fromFirestoreFields(response.data);
    } catch (error) {
      console.error(`Failed to update status for order ${id}:`, error);
      throw error;
    }
  },
};
