import axiosInstance from '../api/axiosInstance';

export const orderService = {
  // Create order (Public)
  createOrder: async (orderData) => {
    try {
      console.log('📡 Creating order:', orderData);
      const response = await axiosInstance.post('/orders', orderData);
      console.log('✅ Order created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  },

  // Track order (Public)
  trackOrder: async (trackingCode, phoneLastDigits) => {
    try {
      console.log('📡 Tracking order:', trackingCode, phoneLastDigits);
      const response = await axiosInstance.get('/orders/track', {
        params: { trackingCode, phoneLastDigits },
      });
      console.log('✅ Order tracked:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error tracking order:', error);
      throw error;
    }
  },

  // Get orders (Admin)
  getOrders: async (params) => {
    try {
      console.log('📡 Fetching orders with params:', params);
      const response = await axiosInstance.get('/orders', { params });
      console.log('✅ Orders fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      throw error;
    }
  },

  // Get order by ID (Admin)
  getOrderById: async (id) => {
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      throw error;
    }
  },

  // Update order status (Admin)
  updateOrderStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw error;
    }
  },

  // Delete order (Admin)
  deleteOrder: async (id) => {
    try {
      const response = await axiosInstance.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      throw error;
    }
  },

  // Get order stats (Admin)
  getOrderStats: async () => {
    try {
      const response = await axiosInstance.get('/orders/stats/summary');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching order stats:', error);
      throw error;
    }
  },
};