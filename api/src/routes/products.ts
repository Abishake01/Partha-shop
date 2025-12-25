import { Router } from 'express';
import { body } from 'express-validator';
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

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/slug/:slug', getProductBySlug);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('stock').isInt({ min: 0 }).withMessage('Valid stock is required'),
    body('categoryId').notEmpty().withMessage('Category is required'),
    body('brandId').notEmpty().withMessage('Brand is required'),
    validate,
  ],
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  updateProduct
);

router.delete('/:id', authenticate, authorize('ADMIN'), deleteProduct);

export default router;

