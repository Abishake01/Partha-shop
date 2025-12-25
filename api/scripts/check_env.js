import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

console.log('🔍 Checking Environment Variables...\n');

const requiredVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};

const optionalVars = {
  PORT: process.env.PORT || '5000 (default)',
  NODE_ENV: process.env.NODE_ENV || 'development (default)',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'Not set',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'Not set',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'Not set',
};

let hasErrors = false;

console.log('Required Variables:');
console.log('─'.repeat(50));
for (const [key, value] of Object.entries(requiredVars)) {
  if (!value) {
    console.log(`❌ ${key}: NOT SET`);
    hasErrors = true;
  } else if (value.includes('your_') || value.includes('your-')) {
    console.log(`⚠️  ${key}: Set but using placeholder value`);
    hasErrors = true;
  } else {
    const masked = value.length > 20 ? value.substring(0, 10) + '...' + value.substring(value.length - 5) : '***';
    console.log(`✅ ${key}: ${masked}`);
  }
}

console.log('\nOptional Variables:');
console.log('─'.repeat(50));
for (const [key, value] of Object.entries(optionalVars)) {
  console.log(`${value === 'Not set' ? '⚠️' : '✅'} ${key}: ${value}`);
}

if (hasErrors) {
  console.log('\n❌ Some required environment variables are missing or using placeholder values!');
  console.log('Please check your .env file in the api/ directory.');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!');
  process.exit(0);
}

