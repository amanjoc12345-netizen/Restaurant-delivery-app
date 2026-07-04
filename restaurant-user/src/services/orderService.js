import { firestoreApi, toFirestoreFields, fromFirestoreFields } from '../api/firebaseApi';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

export const orderService = {
  // Place a new order
  placeOrder: async (orderData, idToken) => {
    try {
      // Serialize items list to JSON string for simple and bulletproof Firestore REST storage
      const payloadData = {
        userId: orderData.userId,
        customerName: orderData.customerName,
        address: orderData.address,
        contact: orderData.contact,
        itemsJson: JSON.stringify(orderData.items),
        total: parseFloat(orderData.total),
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      const payload = toFirestoreFields(payloadData);
      
      const response = await firestoreApi.post(
        `/orders?key=${apiKey}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      
      return fromFirestoreFields(response.data);
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  },

  // Get orders placed by a specific customer
  getCustomerOrders: async (userId, idToken) => {
    try {
      const response = await firestoreApi.get(
        `/orders?key=${apiKey}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (response.data && response.data.documents) {
        const allOrders = response.data.documents.map(fromFirestoreFields);
        
        // Filter orders by current user ID and parse the serialized items JSON back to an array
        return allOrders
          .filter((order) => order.userId === userId)
          .map((order) => {
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
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first
      }

      return [];
    } catch (error) {
      // If collection doesn't exist yet, return empty
      if (error.response && error.response.status === 404) {
        return [];
      }
      console.error(`Failed to fetch orders for user ${userId}:`, error);
      throw error;
    }
  },
};
