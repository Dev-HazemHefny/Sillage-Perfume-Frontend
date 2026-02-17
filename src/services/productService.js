import axiosInstance from '../api/axiosInstance';

export const productService = {
  getProducts: async (params) => {
    try {
      const response = await axiosInstance.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFilters: async () => {
    try {
      const response = await axiosInstance.get('/products/filters/available');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ FormData already built correctly in adminProducts.jsx
  // Just send it with multipart header
  createProduct: async (formData) => {
    try {
      console.log('📡 Creating product...');
      // Debug: log what we're sending
      for (let [key, val] of formData.entries()) {
        console.log(`  ${key}:`, val instanceof File ? `File(${val.name})` : val);
      }

      const response = await axiosInstance.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error creating product:', error.response?.data || error);
      throw error;
    }
  },

  updateProduct: async (id, formData) => {
    try {
      console.log('📡 Updating product:', id);
      for (let [key, val] of formData.entries()) {
        console.log(`  ${key}:`, val instanceof File ? `File(${val.name})` : val);
      }

      const response = await axiosInstance.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error updating product:', error.response?.data || error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateStock: async (id, data) => {
    try {
      const response = await axiosInstance.patch(`/products/${id}/stock`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};