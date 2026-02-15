import axiosInstance from "../api/axiosInstance";

export const authService = {
  // Login
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Register (First Admin)
  register: async (data) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  // Get Profile
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Update Profile
  updateProfile: async (data) => {
    const response = await axiosInstance.put('/auth/profile', data);
    return response.data;
  },

  // Change Password
  changePassword: async (data) => {
    const response = await axiosInstance.put('/auth/change-password', data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },
};