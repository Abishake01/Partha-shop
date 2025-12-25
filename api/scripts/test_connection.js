// Test different connection string formats
// This helps diagnose the authentication issue

const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  const dbUrl = process.env.DATABASE_URL;
  console.log('Testing database connection...\n');
  console.log('DATABASE_URL:', dbUrl.replace(/:[^:@]+@/, ':****@')); // Hide password
  console.log('');

  // Try different password encoding methods
  const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!urlMatch) {
    console.error('Invalid DATABASE_URL format');
    return;
  }

  const [, username, password, host, port, database] = urlMatch;
  
  console.log('Connection parameters:');
  console.log('  Host:', host);
  console.log('  Port:', port);
  console.log('  Database:', database);
  console.log('  Username:', username);
  console.log('  Password length:', password.length);
  console.log('  Password (raw):', password);
  console.log('');

  // Try 1: Direct connection with raw password
  console.log('Test 1: Direct connection with raw password...');
  try {
    const conn1 = await mysql.createConnection({
      host: host,
      port: parseInt(port),
      user: username,
      password: password,
      database: database,
    });
    console.log('✅ SUCCESS with raw password!');
    await conn1.end();
    return;
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }

  // Try 2: URL decode the password
  console.log('\nTest 2: Trying URL-decoded password...');
  try {
    const decodedPassword = decodeURIComponent(password);
    const conn2 = await mysql.createConnection({
      host: host,
      port: parseInt(port),
      user: username,
      password: decodedPassword,
      database: database,
    });
    console.log('✅ SUCCESS with decoded password!');
    await conn2.end();
    return;
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }

  // Try 3: Manual password (user should verify)
  console.log('\n⚠️  Both methods failed.');
  console.log('\nPlease verify:');
  console.log('1. Go to phpMyAdmin and test login manually');
  console.log('2. Username:', username);
  console.log('3. Password should be: G9!nLgd7:');
  console.log('4. If phpMyAdmin works but this doesn\'t, there might be IP restrictions');
  console.log('\nTry updating .env with URL-encoded password:');
  console.log('DATABASE_URL="mysql://u304535605_parthi:G9%21nLgd7%3A@auth-db2109.hstgr.io:3306/u304535605_Mobileshop"');
}

testConnection();

