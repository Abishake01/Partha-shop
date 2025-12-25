// Quick script to verify admin user exists and can login
// Run with: node scripts/verify_admin.js

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function verifyAdmin() {
  let connection;
  
  try {
    console.log('🔍 Verifying admin user...\n');
    
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('❌ DATABASE_URL not found');
      return;
    }

    const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!urlMatch) {
      console.error('❌ Invalid DATABASE_URL');
      return;
    }

    const [, username, password, host, port, database] = urlMatch;
    
    connection = await mysql.createConnection({
      host: host,
      port: parseInt(port),
      user: username,
      password: password,
      database: database,
    });

    console.log('✅ Connected to database\n');

    // Find admin user
    const [users] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      ['admin@mobileshop.com']
    );

    if (users.length === 0) {
      console.log('❌ Admin user NOT found!\n');
      console.log('Run this SQL in phpMyAdmin:\n');
      console.log(`
INSERT INTO \`users\` (
  \`id\`, \`email\`, \`password\`, \`first_name\`, \`last_name\`, \`role\`, \`is_blocked\`, \`created_at\`, \`updated_at\`
) VALUES (
  UUID(),
  'admin@mobileshop.com',
  '$2a$10$O7REiCPdm8yeCkWI9wyIg.SeFOemBK.04CGX0CuY3Fr2d8LcY/vwO',
  'Admin',
  'User',
  'ADMIN',
  FALSE,
  NOW(),
  NOW()
);
      `);
      return;
    }

    const admin = users[0];
    console.log('✅ Admin user found!\n');
    console.log('User Details:');
    console.log('  ID:', admin.id);
    console.log('  Email:', admin.email);
    console.log('  Name:', admin.first_name, admin.last_name);
    console.log('  Role:', admin.role);
    console.log('  Blocked:', admin.is_blocked ? 'Yes ❌' : 'No ✅');
    console.log('');

    // Test password
    const testPassword = 'Admin@123';
    const passwordMatch = await bcrypt.compare(testPassword, admin.password);
    
    if (passwordMatch) {
      console.log('✅ Password verification: SUCCESS');
      console.log('   Password "Admin@123" matches the hash\n');
    } else {
      console.log('❌ Password verification: FAILED');
      console.log('   Password "Admin@123" does NOT match\n');
      console.log('   The password hash in database might be incorrect');
      console.log('   Re-run the create_admin_simple.sql script\n');
    }

    // Final status
    if (admin.role === 'ADMIN' && !admin.is_blocked && passwordMatch) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Admin user is ready to use!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('Login credentials:');
      console.log('  Email: admin@mobileshop.com');
      console.log('  Password: Admin@123');
      console.log('');
      console.log('Go to: http://localhost:5174');
    } else {
      console.log('⚠️  Admin user has issues:');
      if (admin.role !== 'ADMIN') {
        console.log('   - Role is not ADMIN (current:', admin.role + ')');
      }
      if (admin.is_blocked) {
        console.log('   - User is blocked');
      }
      if (!passwordMatch) {
        console.log('   - Password hash is incorrect');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nDatabase authentication failed!');
      console.error('Check your .env file DATABASE_URL');
    }
  } finally {
    if (connection) await connection.end();
  }
}

verifyAdmin();

