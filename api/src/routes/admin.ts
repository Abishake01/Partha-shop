import { Router } from 'express';
import { body } from 'express-validator';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  toggleUserBlock,
  getUserOrders,
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('ADMIN'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Orders
router.get('/orders', getAllOrders);
router.put(
  '/orders/:id/status',
  [
    body('status')
      .isIn(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
      .withMessage('Invalid order status'),
    validate,
  ],
  updateOrderStatus
);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleUserBlock);
router.get('/users/:userId/orders', getUserOrders);

export default router;

