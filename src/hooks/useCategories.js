import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';

export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoryService.getCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaced cacheTime)
  });
};

export const useCategory = (id) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => categoryService.updateCategory(id, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // ✅ Extract _id if full object passed
    mutationFn: (idOrObject) => {
      const id = typeof idOrObject === 'object' ? idOrObject._id : idOrObject;
      return categoryService.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// For backwards compatibility
export default useCategories;