// Utility helpers for common operations

import { APP_CONSTANTS } from './constants';

/**
 * Format price to 2 decimal places
 */
export const formatPrice = (price: number): number => {
  return Math.round(price * 100) / 100;
};

/**
 * Validate price range
 */
export const isValidPrice = (price: number): boolean => {
  return price >= APP_CONSTANTS.MIN_PRICE && price <= APP_CONSTANTS.MAX_PRICE;
};

/**
 * Validate stock amount
 */
export const isValidStock = (stock: number): boolean => {
  return Number.isInteger(stock) && stock >= APP_CONSTANTS.MIN_STOCK;
};

/**
 * Validate rating
 */
export const isValidRating = (rating: number): boolean => {
  return rating >= APP_CONSTANTS.MIN_RATING && rating <= APP_CONSTANTS.MAX_RATING;
};

/**
 * Generate slug from text
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Calculate pagination offset
 */
export const calculateOffset = (page: number = 1, limit: number = APP_CONSTANTS.DEFAULT_LIMIT): number => {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(limit, APP_CONSTANTS.MAX_LIMIT);
  return (validPage - 1) * validLimit;
};

/**
 * Format pagination response
 */
export const formatPaginationResponse = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page: Math.max(1, page),
    limit: Math.min(limit, APP_CONSTANTS.MAX_LIMIT),
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check password strength
 */
export const validatePasswordStrength = (password: string): { valid: boolean; message?: string } => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }

  if (password.length < APP_CONSTANTS.MIN_PASSWORD_LENGTH) {
    return { valid: false, message: `Password must be at least ${APP_CONSTANTS.MIN_PASSWORD_LENGTH} characters` };
  }

  if (password.length > APP_CONSTANTS.MAX_PASSWORD_LENGTH) {
    return { valid: false, message: `Password must not exceed ${APP_CONSTANTS.MAX_PASSWORD_LENGTH} characters` };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return {
      valid: false,
      message: 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)',
    };
  }

  return { valid: true };
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Check if date is within days
 */
export const isWithinDays = (date: Date, days: number): boolean => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - targetDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days;
};

/**
 * Convert bytes to human-readable format
 */
export const formatBytes = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

/**
 * Generate random token
 */
export const generateToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

/**
 * Check file is allowed image type
 */
export const isAllowedImageType = (mimeType: string): boolean => {
  return APP_CONSTANTS.ALLOWED_IMAGE_TYPES.includes(mimeType as typeof APP_CONSTANTS.ALLOWED_IMAGE_TYPES[number]);
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, length: number, suffix: string = '...'): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
};
