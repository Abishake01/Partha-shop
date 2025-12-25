// Script to create admin user
// Run with: node scripts/create_admin.js

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'admin@mobileshop.com';
    const password = 'Admin@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', email);
      console.log('Password:', password);
      return;
    }

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: admin@mobileshop.com');
    console.log('Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    if (error.message.includes('Authentication failed')) {
      console.error('\n❌ Database connection failed!');
      console.error('Please check your DATABASE_URL in .env file');
      console.error('\nAlternative: Create admin via API registration endpoint:');
      console.error('POST http://localhost:5000/api/auth/register');
      console.error('Body: {');
      console.error('  "email": "admin@mobileshop.com",');
      console.error('  "password": "Admin@123",');
      console.error('  "firstName": "Admin",');
      console.error('  "lastName": "User"');
      console.error('}');
      console.error('\nThen update the user role to ADMIN in phpMyAdmin:');
      console.error('UPDATE users SET role = "ADMIN" WHERE email = "admin@mobileshop.com";');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

