import axiosInstance from '../api/axiosInstance';

export const productService = {
  // Get all products with filters
  getProducts: async (params) => {
    try {
      console.log('📡 Fetching products with params:', params);
      const response = await axiosInstance.get('/products', { params });
      console.log('✅ Products fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  },

  // Get single product
  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      throw error;
    }
  },

  // Get available filters
  getFilters: async () => {
    try {
      console.log('📡 Fetching filters...');
      const response = await axiosInstance.get('/products/filters');
      console.log('✅ Filters fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching filters:', error);
      throw error;
    }
  },

  // Create product (Admin)
  createProduct: async (formData) => {
    try {
      const response = await axiosInstance.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error creating product:', error);
      throw error;
    }
  },

  // Update product (Admin)
  updateProduct: async (id, formData) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error updating product:', error);
      throw error;
    }
  },

  // Delete product (Admin)
  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      throw error;
    }
  },

  // Update stock (Admin)
  updateStock: async (id, data) => {
    try {
      const response = await axiosInstance.patch(`/products/${id}/stock`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating stock:', error);
      throw error;
    }
  },
};