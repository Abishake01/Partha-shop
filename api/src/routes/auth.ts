import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  getProfile,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { authValidationRules } from '../middleware/validationRules';

const router = Router();

// Register
router.post('/register', authValidationRules.register, validate, register);

// Login
router.post('/login', authValidationRules.login, validate, login);

// Refresh token
router.post('/refresh', refreshToken);

// Get profile (protected)
router.get('/profile', authenticate, getProfile);

// Logout (protected)
router.post('/logout', authenticate, logout);

// Forgot password
router.post('/forgot-password', authValidationRules.forgotPassword, validate, forgotPassword);

// Reset password
router.post('/reset-password', authValidationRules.resetPassword, validate, resetPassword);

export default router;

