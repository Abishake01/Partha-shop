import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

if (!jwtSecret || jwtSecret === 'your-secret-key' || jwtSecret === 'your_jwt_secret_key_here_change_this') {
  console.warn('⚠️  WARNING: JWT_SECRET is not set or using default value. Please set a strong secret in .env file');
}

if (!jwtRefreshSecret || jwtRefreshSecret === 'your-refresh-secret-key' || jwtRefreshSecret === 'your_jwt_refresh_secret_key_here_change_this') {
  console.warn('⚠️  WARNING: JWT_REFRESH_SECRET is not set or using default value. Please set a strong secret in .env file');
}

export const jwtConfig = {
  secret: jwtSecret || 'your-secret-key',
  refreshSecret: jwtRefreshSecret || 'your-refresh-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};

