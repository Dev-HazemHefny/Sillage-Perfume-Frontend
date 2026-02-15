import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.admin));
      queryClient.setQueryData(['user'], data.data.admin);
      toast.success('Welcome back!');
      navigate('/admin');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: authService.getProfile,
    enabled: !!localStorage.getItem('token'),
    retry: false,
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    },
  });
};