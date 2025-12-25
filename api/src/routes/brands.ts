import { Router } from 'express';
import { body } from 'express-validator';
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';

const router = Router();

// Public routes
router.get('/', getBrands);
router.get('/:id', getBrand);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  [body('name').notEmpty().withMessage('Brand name is required'), validate],
  createBrand
);

router.put('/:id', authenticate, authorize('ADMIN'), updateBrand);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteBrand);

export default router;

