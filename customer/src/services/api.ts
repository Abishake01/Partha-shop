import axios from 'axios';
import { ApiResponse, AuthResponse, PaginatedResponse, Product, CartItem, Order, Address, WishlistItem, User } from '../types';

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
    const token = localStorage.getItem('token');
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
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  getProfile: () => api.get<ApiResponse<User>>('/auth/profile'),
  logout: () => api.post('/auth/logout'),
};

// Product APIs
export const productApi = {
  getProducts: (params?: any) => api.get<PaginatedResponse<Product>>('/products', { params }),
  getProduct: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`),
  getProductBySlug: (slug: string) => api.get<ApiResponse<Product>>(`/products/slug/${slug}`),
};

// Category APIs
export const categoryApi = {
  getCategories: () => api.get<ApiResponse<Category[]>>('/categories'),
  getCategory: (id: string) => api.get<ApiResponse<Category>>(`/categories/${id}`),
};

// Brand APIs
export const brandApi = {
  getBrands: () => api.get<ApiResponse<Brand[]>>('/brands'),
  getBrand: (id: string) => api.get<ApiResponse<Brand>>(`/brands/${id}`),
};

// Cart APIs
export const cartApi = {
  getCart: () => api.get<ApiResponse<CartItem[]>>('/cart'),
  addToCart: (data: { productId: string; quantity?: number }) =>
    api.post<ApiResponse<CartItem>>('/cart', data),
  updateCartItem: (id: string, data: { quantity: number }) =>
    api.put<ApiResponse<CartItem>>(`/cart/${id}`, data),
  removeFromCart: (id: string) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart'),
};

// Order APIs
export const orderApi = {
  createOrder: (data: { addressId: string; paymentMethod?: string }) =>
    api.post<ApiResponse<Order>>('/orders', data),
  getOrders: (params?: any) => api.get<PaginatedResponse<Order>>('/orders', { params }),
  getOrder: (id: string) => api.get<ApiResponse<Order>>(`/orders/${id}`),
};

// User APIs
export const userApi = {
  updateProfile: (data: { firstName: string; lastName: string; phone?: string }) =>
    api.put<ApiResponse<User>>('/users/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/change-password', data),
  getAddresses: () => api.get<ApiResponse<Address[]>>('/users/addresses'),
  createAddress: (data: Partial<Address>) =>
    api.post<ApiResponse<Address>>('/users/addresses', data),
  updateAddress: (id: string, data: Partial<Address>) =>
    api.put<ApiResponse<Address>>(`/users/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),
  getWishlist: () => api.get<ApiResponse<WishlistItem[]>>('/users/wishlist'),
  addToWishlist: (data: { productId: string }) =>
    api.post<ApiResponse<WishlistItem>>('/users/wishlist', data),
  removeFromWishlist: (productId: string) =>
    api.delete(`/users/wishlist/${productId}`),
};

export default api;

