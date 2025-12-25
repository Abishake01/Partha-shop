import axios from 'axios';
import { ApiResponse, AuthResponse, PaginatedResponse, Product, Order, User, Category, Brand, DashboardStats } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('adminRefreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminRefreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  getProfile: () => api.get<ApiResponse<User>>('/auth/profile'),
  logout: () => api.post('/auth/logout'),
};

// Dashboard APIs
export const dashboardApi = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/admin/dashboard'),
};

// Product APIs
export const productApi = {
  getProducts: (params?: any) => api.get<PaginatedResponse<Product>>('/products', { params }),
  getProduct: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`),
  createProduct: (data: any) => api.post<ApiResponse<Product>>('/products', data),
  updateProduct: (id: string, data: any) => api.put<ApiResponse<Product>>(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
};

// Category APIs
export const categoryApi = {
  getCategories: () => api.get<ApiResponse<Category[]>>('/categories'),
  createCategory: (data: Partial<Category>) => api.post<ApiResponse<Category>>('/categories', data),
  updateCategory: (id: string, data: Partial<Category>) => api.put<ApiResponse<Category>>(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
};

// Brand APIs
export const brandApi = {
  getBrands: () => api.get<ApiResponse<Brand[]>>('/brands'),
  createBrand: (data: Partial<Brand>) => api.post<ApiResponse<Brand>>('/brands', data),
  updateBrand: (id: string, data: Partial<Brand>) => api.put<ApiResponse<Brand>>(`/brands/${id}`, data),
  deleteBrand: (id: string) => api.delete(`/brands/${id}`),
};

// Order APIs
export const orderApi = {
  getOrders: (params?: any) => api.get<PaginatedResponse<Order>>('/admin/orders', { params }),
  updateOrderStatus: (id: string, status: string) =>
    api.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status }),
};

// User APIs
export const userApi = {
  getUsers: (params?: any) => api.get<PaginatedResponse<User>>('/admin/users', { params }),
  toggleUserBlock: (id: string) => api.put<ApiResponse<User>>(`/admin/users/${id}/block`),
  getUserOrders: (userId: string) => api.get<ApiResponse<Order[]>>(`/admin/users/${userId}/orders`),
};

export default api;

