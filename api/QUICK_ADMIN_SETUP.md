# Quick Admin Setup

## Default Admin Credentials

**Email:** `admin@mobileshop.com`  
**Password:** `Admin@123`

## Easiest Method: Use API Registration

1. **Make sure your API server is running** (even if database connection shows errors, the registration might work)

2. **Register the admin user using curl or Postman:**

   **Using curl:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"admin@mobileshop.com\",\"password\":\"Admin@123\",\"firstName\":\"Admin\",\"lastName\":\"User\"}"
   ```

   **Or use Postman/Thunder Client:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "email": "admin@mobileshop.com",
       "password": "Admin@123",
       "firstName": "Admin",
       "lastName": "User"
     }
     ```

3. **Update role to ADMIN in phpMyAdmin:**
   - Go to your phpMyAdmin URL
   - Click on `users` table
   - Find the row with email `admin@mobileshop.com`
   - Click "Edit"
   - Change `role` from `USER` to `ADMIN`
   - Click "Go" to save

4. **Login to admin dashboard:**
   - Go to: http://localhost:5174
   - Email: `admin@mobileshop.com`
   - Password: `Admin@123`

## Alternative: Direct SQL (if API doesn't work)

Run this in phpMyAdmin SQL tab:

```sql
-- First, generate password hash using online bcrypt generator
-- Password: Admin@123
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

INSERT INTO `users` (
  `id`,
  `email`,
  `password`,
  `first_name`,
  `last_name`,
  `role`,
  `is_blocked`,
  `created_at`,
  `updated_at`
) VALUES (
  UUID(),
  'admin@mobileshop.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin',
  'User',
  'ADMIN',
  FALSE,
  NOW(),
  NOW()
);
```

⚠️ **Important:** Change the password after first login!

