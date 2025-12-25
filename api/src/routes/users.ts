import { Router } from 'express';
import { body } from 'express-validator';
import {
  updateProfile,
  changePassword,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile
router.put('/profile', updateProfile);
router.put(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validate,
  ],
  changePassword
);

// Addresses
router.get('/addresses', getAddresses);
router.post(
  '/addresses',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('addressLine1').notEmpty().withMessage('Address line 1 is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('postalCode').notEmpty().withMessage('Postal code is required'),
    validate,
  ],
  createAddress
);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

// Wishlist
router.get('/wishlist', getWishlist);
router.post(
  '/wishlist',
  [body('productId').notEmpty().withMessage('Product ID is required'), validate],
  addToWishlist
);
router.delete('/wishlist/:productId', removeFromWishlist);

export default router;

