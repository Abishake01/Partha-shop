// Centralized validation rules for all API endpoints

import { body, param, query } from 'express-validator';
import { APP_CONSTANTS, API_MESSAGES } from '../utils/constants';
import { validatePasswordStrength, isValidEmail, isValidPrice, isValidStock, isValidRating } from '../utils/helpers';

// ============== AUTH VALIDATION RULES ==============

export const authValidationRules = {
  register: [
    body('email')
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage(API_MESSAGES.INVALID_EMAIL)
      .isLength({ max: 255 })
      .withMessage('Email must not exceed 255 characters'),

    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .custom((value) => {
        const validation = validatePasswordStrength(value);
        if (!validation.valid) {
          throw new Error(validation.message);
        }
        return true;
      }),

    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),

    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
  ],

  login: [
    body('email')
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage(API_MESSAGES.INVALID_EMAIL),

    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],

  forgotPassword: [
    body('email')
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage(API_MESSAGES.INVALID_EMAIL),
  ],

  resetPassword: [
    body('token')
      .notEmpty()
      .withMessage('Token is required')
      .trim(),

    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .custom((value) => {
        const validation = validatePasswordStrength(value);
        if (!validation.valid) {
          throw new Error(validation.message);
        }
        return true;
      }),
  ],
};

// ============== PRODUCT VALIDATION RULES ==============

export const productValidationRules = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ min: 1, max: 255 })
      .withMessage('Product name must be between 1 and 255 characters'),

    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10, max: 5000 })
      .withMessage('Description must be between 10 and 5000 characters'),

    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: APP_CONSTANTS.MIN_PRICE })
      .withMessage(`Price must be at least ₹${APP_CONSTANTS.MIN_PRICE}`)
      .custom((value) => {
        if (!isValidPrice(parseFloat(value))) {
          throw new Error(API_MESSAGES.INVALID_PRICE);
        }
        return true;
      }),

    body('discountPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Discount price must be a valid number')
      .custom((value, { req }) => {
        if (value && parseFloat(value) >= parseFloat(req.body.price)) {
          throw new Error('Discount price must be less than original price');
        }
        return true;
      }),

    body('stock')
      .notEmpty()
      .withMessage('Stock is required')
      .isInt({ min: 0 })
      .withMessage(API_MESSAGES.INVALID_STOCK)
      .custom((value) => {
        if (!isValidStock(parseInt(value))) {
          throw new Error(API_MESSAGES.INVALID_STOCK);
        }
        return true;
      }),

    body('categoryId')
      .trim()
      .notEmpty()
      .withMessage('Category is required')
      .isUUID()
      .withMessage('Invalid category ID'),

    body('brandId')
      .trim()
      .notEmpty()
      .withMessage('Brand is required')
      .isUUID()
      .withMessage('Invalid brand ID'),
  ],

  update: [
    param('id')
      .isUUID()
      .withMessage('Invalid product ID'),

    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Product name must be between 1 and 255 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage('Description must be between 10 and 5000 characters'),

    body('price')
      .optional()
      .isFloat({ min: APP_CONSTANTS.MIN_PRICE })
      .withMessage(`Price must be at least ₹${APP_CONSTANTS.MIN_PRICE}`)
      .custom((value) => {
        if (value && !isValidPrice(parseFloat(value))) {
          throw new Error(API_MESSAGES.INVALID_PRICE);
        }
        return true;
      }),

    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage(API_MESSAGES.INVALID_STOCK),
  ],

  getById: [
    param('id')
      .isUUID()
      .withMessage('Invalid product ID'),
  ],

  delete: [
    param('id')
      .isUUID()
      .withMessage('Invalid product ID'),
  ],
};

// ============== CATEGORY VALIDATION RULES ==============

export const categoryValidationRules = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Category name is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Category name must be between 1 and 100 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters'),
  ],

  update: [
    param('id')
      .isUUID()
      .withMessage('Invalid category ID'),

    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Category name must be between 1 and 100 characters'),
  ],
};

// ============== BRAND VALIDATION RULES ==============

export const brandValidationRules = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Brand name is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Brand name must be between 1 and 100 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters'),
  ],
};

// ============== ORDER VALIDATION RULES ==============

export const orderValidationRules = {
  create: [
    body('addressId')
      .trim()
      .notEmpty()
      .withMessage('Address ID is required')
      .isUUID()
      .withMessage('Invalid address ID'),

    body('paymentMethod')
      .trim()
      .notEmpty()
      .withMessage('Payment method is required')
      .isIn(['COD', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI'])
      .withMessage('Invalid payment method'),
  ],

  updateStatus: [
    param('id')
      .isUUID()
      .withMessage('Invalid order ID'),

    body('status')
      .trim()
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'])
      .withMessage('Invalid order status'),
  ],
};

// ============== REVIEW VALIDATION RULES ==============

export const reviewValidationRules = {
  create: [
    body('productId')
      .trim()
      .notEmpty()
      .withMessage('Product ID is required')
      .isUUID()
      .withMessage('Invalid product ID'),

    body('rating')
      .notEmpty()
      .withMessage('Rating is required')
      .isInt({ min: APP_CONSTANTS.MIN_RATING, max: APP_CONSTANTS.MAX_RATING })
      .withMessage(`Rating must be between ${APP_CONSTANTS.MIN_RATING} and ${APP_CONSTANTS.MAX_RATING}`),

    body('title')
      .trim()
      .notEmpty()
      .withMessage('Review title is required')
      .isLength({ min: 5, max: 100 })
      .withMessage('Review title must be between 5 and 100 characters'),

    body('comment')
      .trim()
      .notEmpty()
      .withMessage('Review comment is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Review comment must be between 10 and 1000 characters'),
  ],
};

// ============== PAGINATION VALIDATION RULES ==============

export const paginationValidationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: APP_CONSTANTS.MAX_LIMIT })
    .withMessage(`Limit must be between 1 and ${APP_CONSTANTS.MAX_LIMIT}`),
];

// ============== ADDRESS VALIDATION RULES ==============

export const addressValidationRules = {
  create: [
    body('street')
      .trim()
      .notEmpty()
      .withMessage('Street is required')
      .isLength({ min: 5, max: 255 })
      .withMessage('Street must be between 5 and 255 characters'),

    body('city')
      .trim()
      .notEmpty()
      .withMessage('City is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('City must be between 2 and 50 characters'),

    body('state')
      .trim()
      .notEmpty()
      .withMessage('State is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('State must be between 2 and 50 characters'),

    body('pinCode')
      .trim()
      .notEmpty()
      .withMessage('Pin code is required')
      .matches(/^\d{6}$/)
      .withMessage('Pin code must be 6 digits'),

    body('country')
      .trim()
      .notEmpty()
      .withMessage('Country is required'),

    body('phoneNumber')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Invalid phone number format'),
  ],
};
