# Fix Database Connection Issue

## The Problem

The database connection is failing with authentication error. This is likely due to:
1. Password special characters (! and :) in connection string
2. IP address restrictions on Hostinger database
3. Connection string format issues

## Solutions

### Solution 1: Verify Credentials in phpMyAdmin

1. Go to: https://auth-db2109.hstgr.io/index.php?db=u304535605_Mobileshop
2. Try logging in with:
   - Username: `u304535605_parthi`
   - Password: `G9!nLgd7:`
3. If this works, the credentials are correct

### Solution 2: Check IP Restrictions

Hostinger databases might have IP restrictions. Check:
1. Hostinger control panel → Databases
2. Look for "Remote MySQL" or "Allowed IPs"
3. Add your current IP address if needed
4. Or allow all IPs (0.0.0.0) for development

### Solution 3: Try Different Connection String Formats

Update your `.env` file and try these formats:

**Format 1: URL-encoded password**
```env
DATABASE_URL="mysql://u304535605_parthi:G9%21nLgd7%3A@auth-db2109.hstgr.io:3306/u304535605_Mobileshop"
```

**Format 2: Raw password (current)**
```env
DATABASE_URL="mysql://u304535605_parthi:G9!nLgd7:@auth-db2109.hstgr.io:3306/u304535605_Mobileshop"
```

**Format 3: Separate connection parameters (if using mysql2 directly)**
```javascript
{
  host: 'auth-db2109.hstgr.io',
  port: 3306,
  user: 'u304535605_parthi',
  password: 'G9!nLgd7:',
  database: 'u304535605_Mobileshop'
}
```

### Solution 4: Use phpMyAdmin for Data Management

Since Prisma connection is having issues, you can:
1. Create tables using `prisma/init.sql` in phpMyAdmin ✅ (You already did this)
2. Create admin user using `prisma/create_admin_simple.sql` in phpMyAdmin
3. Use the test scripts to verify data (they use mysql2 directly)

### Solution 5: Test Connection Script

Run the connection test:
```bash
cd api
node scripts/test_connection.js
```

This will try different password encoding methods and show you what works.

## Current Status

✅ Tables are created (via phpMyAdmin)  
❌ Prisma connection failing (authentication)  
✅ Test scripts can verify data (using mysql2)

## Workaround

Since you can access phpMyAdmin:
1. Use phpMyAdmin to manage data directly
2. Use the test scripts (`test_database.js`, `verify_admin.js`) to verify data
3. Fix Prisma connection later (might need Hostinger support)

The test scripts use mysql2 directly and might work even if Prisma doesn't.

