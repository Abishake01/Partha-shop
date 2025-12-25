# Database Testing Guide

## Quick Tests

### Test 1: Full Database Test
```bash
cd api
bun run test:db
# or
node scripts/test_database.js
```

This will:
- ✅ Test database connection
- ✅ List all tables
- ✅ Check table structures
- ✅ Count users
- ✅ Verify admin user exists
- ✅ Check password hash format
- ✅ List all users

### Test 2: Quick Admin Verification
```bash
cd api
bun run test:admin
# or
node scripts/verify_admin.js
```

This will:
- ✅ Check if admin user exists
- ✅ Verify password hash is correct
- ✅ Test password "Admin@123" against hash
- ✅ Check user role and status

## What the Tests Check

### Connection Test
- Verifies DATABASE_URL is correct
- Tests MySQL connection
- Shows connection details (without password)

### Tables Test
- Lists all created tables
- Verifies table structure
- Checks for required columns

### Admin User Test
- Checks if admin@mobileshop.com exists
- Verifies role is ADMIN
- Checks if user is blocked
- Tests password hash format
- Verifies password "Admin@123" works

## Expected Output

### Successful Test:
```
✅ Database connection successful!
✅ Found 10 tables
✅ Admin user found!
✅ Password is properly hashed (bcrypt)
✅ All database tests passed!
```

### If Admin Missing:
```
❌ Admin user NOT found!
Run this SQL in phpMyAdmin:
[SQL INSERT statement]
```

## Troubleshooting

### Connection Failed
- Check DATABASE_URL in .env file
- Verify credentials are correct
- Check if database server is accessible

### Admin Not Found
- Run `create_admin_simple.sql` in phpMyAdmin
- Or use the SQL provided in test output

### Password Hash Wrong
- Re-run `create_admin_simple.sql`
- Make sure you're using the correct hash

## After Running Tests

If all tests pass:
1. ✅ Database is working
2. ✅ Admin user is ready
3. ✅ You can login to admin dashboard

If tests fail:
1. Check the error message
2. Follow the suggested fixes
3. Re-run the test

