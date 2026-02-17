import axiosInstance from '../api/axiosInstance';

export const categoryService = {
  // Get all categories
  getCategories: async (params) => {
    try {
      console.log('📡 Fetching categories with params:', params);
      const response = await axiosInstance.get('/categories', { params });
      console.log('✅ Categories fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      throw error;
    }
  },

  // Get single category
  getCategoryById: async (id) => {
    try {
      const response = await axiosInstance.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching category:', error);
      throw error;
    }
  },

  // Create category (Admin)
  createCategory: async (formData) => {
    try {
      const response = await axiosInstance.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error creating category:', error);
      throw error;
    }
  },

  // Update category (Admin)
  updateCategory: async (id, formData) => {
    try {
      const response = await axiosInstance.put(`/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error updating category:', error);
      throw error;
    }
  },

  // Delete category (Admin)
 deleteCategory: async (id) => {
  try {
    // ✅ Handle if full object was passed instead of ID
    const categoryId = typeof id === 'object' ? id._id : id;
    const response = await axiosInstance.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    throw error;
  }
},
};