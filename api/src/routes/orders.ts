import { Router } from 'express';
import { body } from 'express-validator';
import { createOrder, getOrders, getOrder } from '../controllers/orderController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';

const router = Router();

// All order routes require authentication
router.use(authenticate);

router.post(
  '/',
  [
    body('addressId').notEmpty().withMessage('Address ID is required'),
    body('paymentMethod').optional().isIn(['COD']).withMessage('Only COD payment is supported'),
    validate,
  ],
  createOrder
);

router.get('/', getOrders);
router.get('/:id', getOrder);

export default router;

