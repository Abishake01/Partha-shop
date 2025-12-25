# Enable Remote MySQL Access on Hostinger

## The Issue

Your database connection is being blocked because Hostinger restricts MySQL access to their servers only. The error shows:
```
Access denied for user 'u304535605_parthi'@'2401:4900:...' (using password: YES)
```

This means your local IP address is not allowed to connect.

## Solution: Enable Remote MySQL Access

### Step 1: Access Hostinger Control Panel

1. Log in to your Hostinger account
2. Go to **hPanel** (Hostinger Control Panel)
3. Navigate to **Databases** → **MySQL Databases**

### Step 2: Enable Remote MySQL

1. Find your database: `u304535605_Mobileshop`
2. Look for **"Remote MySQL"** or **"Access Hosts"** option
3. Click on it
4. Add your current IP address OR
5. Add `%` to allow all IPs (for development only - not recommended for production)

### Step 3: Find Your IP Address

Your current IP (from the error): `2401:4900:4de1:3284:f003:e401:2115:e22`

Or check your IP:
- Visit: https://whatismyipaddress.com/
- Copy your IPv4 address (e.g., `123.45.67.89`)

### Step 4: Add IP to Allowed Hosts

In Hostinger Remote MySQL settings:
- Add: `2401:4900:4de1:3284:f003:e401:2115:e22` (your IPv6)
- OR add: `%` (allows all IPs - use only for development)

### Step 5: Test Connection

After enabling remote access, run:
```bash
cd api
node scripts/test_database.js
```

## Alternative: Verify Data via phpMyAdmin

Since phpMyAdmin works, you can verify your admin user:

1. Go to: https://auth-db2109.hstgr.io/index.php?db=u304535605_Mobileshop
2. Click on `users` table
3. Check if admin user exists:
   ```sql
   SELECT * FROM users WHERE email = 'admin@mobileshop.com';
   ```

If it doesn't exist, run this SQL:
```sql
INSERT INTO `users` (
  `id`, `email`, `password`, `first_name`, `last_name`, `role`, `is_blocked`, `created_at`, `updated_at`
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
```

## After Enabling Remote Access

Once remote MySQL is enabled:
1. ✅ Prisma will be able to connect
2. ✅ API will work properly
3. ✅ Login will function correctly

## Quick Check: Is Admin User Created?

Run this in phpMyAdmin SQL tab:
```sql
SELECT email, role, is_blocked FROM users WHERE email = 'admin@mobileshop.com';
```

Expected result:
- Email: `admin@mobileshop.com`
- Role: `ADMIN`
- Blocked: `0` (false)

If no results, create the admin user using the SQL above.

