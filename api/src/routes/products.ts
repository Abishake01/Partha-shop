import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { uploadMultiple } from '../middleware/upload';
import { productValidationRules, paginationValidationRules } from '../middleware/validationRules';

const router = Router();

// Public routes
router.get('/', paginationValidationRules, validate, getProducts);
router.get('/:id', productValidationRules.getById, validate, getProduct);
router.get('/slug/:slug', getProductBySlug);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  uploadMultiple,
  productValidationRules.create,
  validate,
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  uploadMultiple,
  productValidationRules.update,
  validate,
  updateProduct
);

router.delete('/:id', authenticate, authorize('ADMIN'), productValidationRules.delete, validate, deleteProduct);

export default router;

