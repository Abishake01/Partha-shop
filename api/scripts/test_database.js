// Test Database Connection and Data
// Run with: node scripts/test_database.js

const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabase() {
  let connection;
  
  try {
    console.log('🔍 Testing database connection...\n');
    
    // Parse DATABASE_URL
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('❌ DATABASE_URL not found in .env file');
      return;
    }

    // Extract connection details from DATABASE_URL
    // Format: mysql://username:password@host:port/database
    const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    
    if (!urlMatch) {
      console.error('❌ Invalid DATABASE_URL format');
      console.log('Expected format: mysql://user:password@host:port/database');
      return;
    }

    const [, username, password, host, port, database] = urlMatch;
    
    console.log('Connection Details:');
    console.log('  Host:', host);
    console.log('  Port:', port);
    console.log('  Database:', database);
    console.log('  Username:', username);
    console.log('  Password:', '***' + password.slice(-3));
    console.log('');

    // Create connection
    connection = await mysql.createConnection({
      host: host,
      port: parseInt(port),
      user: username,
      password: password,
      database: database,
    });

    console.log('✅ Database connection successful!\n');

    // Test 1: Check if tables exist
    console.log('📊 Checking tables...');
    const [tables] = await connection.execute(
      "SHOW TABLES"
    );
    
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });
    console.log('');

    // Test 2: Check users table structure
    console.log('👥 Checking users table...');
    const [userColumns] = await connection.execute(
      "DESCRIBE users"
    );
    console.log('✅ Users table structure:');
    userColumns.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type})`);
    });
    console.log('');

    // Test 3: Count users
    const [userCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM users"
    );
    console.log(`📈 Total users in database: ${userCount[0].count}\n`);

    // Test 4: Check for admin user
    console.log('🔐 Checking for admin user...');
    const [adminUsers] = await connection.execute(
      "SELECT id, email, first_name, last_name, role, is_blocked, created_at FROM users WHERE email = ?",
      ['admin@mobileshop.com']
    );

    if (adminUsers.length > 0) {
      const admin = adminUsers[0];
      console.log('✅ Admin user found!');
      console.log('   ID:', admin.id);
      console.log('   Email:', admin.email);
      console.log('   Name:', admin.first_name, admin.last_name);
      console.log('   Role:', admin.role);
      console.log('   Blocked:', admin.is_blocked);
      console.log('   Created:', admin.created_at);
      console.log('');
      
      // Test 5: Verify password hash
      const [passwordHash] = await connection.execute(
        "SELECT password FROM users WHERE email = ?",
        ['admin@mobileshop.com']
      );
      
      if (passwordHash[0].password.startsWith('$2a$') || passwordHash[0].password.startsWith('$2b$')) {
        console.log('✅ Password is properly hashed (bcrypt)');
      } else {
        console.log('⚠️  Password hash format looks incorrect');
        console.log('   Hash:', passwordHash[0].password.substring(0, 20) + '...');
      }
    } else {
      console.log('❌ Admin user NOT found!');
      console.log('   Please run the create_admin_simple.sql script in phpMyAdmin');
    }
    console.log('');

    // Test 6: List all users
    const [allUsers] = await connection.execute(
      "SELECT id, email, first_name, last_name, role FROM users LIMIT 10"
    );
    
    if (allUsers.length > 0) {
      console.log('👤 All users in database:');
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.role}) - ${user.first_name} ${user.last_name}`);
      });
    }
    console.log('');

    // Test 7: Test a simple query
    console.log('🧪 Testing simple query...');
    const [testResult] = await connection.execute("SELECT 1 as test");
    console.log('✅ Query test successful:', testResult[0].test);
    console.log('');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All database tests passed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📝 Summary:');
    console.log('   - Database connection: ✅ Working');
    console.log('   - Tables created: ✅', tables.length, 'tables');
    console.log('   - Admin user:', adminUsers.length > 0 ? '✅ Found' : '❌ Not found');
    console.log('');
    
    if (adminUsers.length === 0) {
      console.log('⚠️  ACTION REQUIRED:');
      console.log('   Run this SQL in phpMyAdmin:');
      console.log('');
      console.log('   INSERT INTO `users` (');
      console.log('     `id`, `email`, `password`, `first_name`, `last_name`, `role`, `is_blocked`, `created_at`, `updated_at`');
      console.log('   ) VALUES (');
      console.log('     UUID(),');
      console.log('     \'admin@mobileshop.com\',');
      console.log('     \'$2a$10$O7REiCPdm8yeCkWI9wyIg.SeFOemBK.04CGX0CuY3Fr2d8LcY/vwO\',');
      console.log('     \'Admin\',');
      console.log('     \'User\',');
      console.log('     \'ADMIN\',');
      console.log('     FALSE,');
      console.log('     NOW(),');
      console.log('     NOW()');
      console.log('   );');
    }

  } catch (error) {
    console.error('❌ Database test failed!');
    console.error('');
    console.error('Error:', error.message);
    console.error('');
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔐 Authentication failed!');
      console.error('   Check your database credentials in .env file');
      console.error('   Make sure username and password are correct');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Connection refused!');
      console.error('   Check if database host and port are correct');
      console.error('   Host:', process.env.DATABASE_URL?.match(/@([^:]+):/)?.[1]);
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('📁 Database not found!');
      console.error('   Check if database name is correct');
    } else {
      console.error('   Error code:', error.code);
      console.error('   Full error:', error);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connection closed');
    }
  }
}

testDatabase();

