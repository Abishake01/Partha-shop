// Application Constants

export const APP_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // Password requirements
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,

  // JWT
  JWT_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',

  // File uploads
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

  // Price validation
  MIN_PRICE: 0.01,
  MAX_PRICE: 999999.99,
  PRICE_DECIMALS: 2,

  // Stock validation
  MIN_STOCK: 0,
  MAX_STOCK: 999999,

  // Order
  DEFAULT_ORDER_STATUS: 'PENDING',
  ORDER_TIMEOUT_MINUTES: 30,

  // Rating
  MIN_RATING: 1,
  MAX_RATING: 5,

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  AUTH_RATE_LIMIT_MAX_REQUESTS: 5,
} as const;

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
} as const;

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export const API_MESSAGES = {
  // Success
  SUCCESS: 'Success',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',

  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',

  // Validation
  VALIDATION_ERROR: 'Validation error',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  INVALID_PRICE: 'Price must be between 0 and 999999.99',
  INVALID_STOCK: 'Stock must be a non-negative integer',
  INVALID_RATING: 'Rating must be between 1 and 5',

  // Product
  PRODUCT_NOT_FOUND: 'Product not found',
  DUPLICATE_SLUG: 'A product with this slug already exists',
  LOW_STOCK: 'Insufficient stock available',

  // Order
  ORDER_NOT_FOUND: 'Order not found',
  ORDER_CANCELLED: 'Order has been cancelled',

  // Cart
  CART_EMPTY: 'Cart is empty',
  ITEM_NOT_IN_CART: 'Item not found in cart',

  // Category
  CATEGORY_NOT_FOUND: 'Category not found',
  CATEGORY_IN_USE: 'Cannot delete category with active products',

  // Brand
  BRAND_NOT_FOUND: 'Brand not found',
  BRAND_IN_USE: 'Cannot delete brand with active products',

  // Server
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  ORDER_CONFIRMATION: 'order-confirmation',
  ORDER_SHIPPED: 'order-shipped',
  ORDER_DELIVERED: 'order-delivered',
  PASSWORD_RESET: 'password-reset',
  EMAIL_VERIFICATION: 'email-verification',
} as const;
