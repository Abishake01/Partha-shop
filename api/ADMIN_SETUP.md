# Admin User Setup Guide

## Default Admin Credentials

**Email:** `admin@mobileshop.com`  
**Password:** `Admin@123`

⚠️ **Important:** Change the password after first login!

## Method 1: Using API Registration (Recommended)

Since the database connection might have issues, the easiest way is to register via the API:

1. **Start the API server:**
   ```bash
   cd api
   bun run dev
   ```

2. **Register the admin user:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@mobileshop.com",
       "password": "Admin@123",
       "firstName": "Admin",
       "lastName": "User"
     }'
   ```

   Or use Postman/Thunder Client:
   - **URL:** `POST http://localhost:5000/api/auth/register`
   - **Body:**
     ```json
     {
       "email": "admin@mobileshop.com",
       "password": "Admin@123",
       "firstName": "Admin",
       "lastName": "User"
     }
     ```

3. **Update user role to ADMIN in phpMyAdmin:**
   - Go to phpMyAdmin
   - Select database `u304535605_Mobileshop`
   - Go to `users` table
   - Find the user with email `admin@mobileshop.com`
   - Edit the `role` field and change it from `USER` to `ADMIN`
   - Save

## Method 2: Using Node.js Script

If database connection works:

```bash
cd api
node scripts/create_admin.js
```

This will create the admin user with properly hashed password.

## Method 3: Manual SQL (Not Recommended)

If you must use SQL directly, you'll need to generate a bcrypt hash first. Use an online bcrypt generator or the Node.js script above.

## After Setup

1. Go to admin dashboard: http://localhost:5174
2. Login with:
   - Email: `admin@mobileshop.com`
   - Password: `Admin@123`
3. **Change the password immediately** in the admin panel!

## Troubleshooting

If you get authentication errors:
- Check that tables are created in the database
- Verify DATABASE_URL in `.env` file
- Try Method 1 (API registration) - it's the most reliable

