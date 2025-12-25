import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', getCart);
router.post(
  '/',
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validate,
  ],
  addToCart
);
router.put(
  '/:id',
  [body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'), validate],
  updateCartItem
);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

export default router;

