# SQL Setup Instructions

## Quick Answer

**If tables already exist:** Just run the INSERT statement from `create_admin_simple.sql`

**If starting fresh:** Run the complete script from `complete_setup.sql`

## Step-by-Step Guide

### Option 1: Tables Already Created (You just need admin user)

1. Open phpMyAdmin: Go to your phpMyAdmin URL
2. Click **SQL** tab
3. Copy and paste this:

```sql
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
  '$2a$10$O7REiCPdm8yeCkWI9wyIg.SeFOemBK.04CGX0CuY3Fr2d8LcY/vwO',
  'Admin',
  'User',
  'ADMIN',
  FALSE,
  NOW(),
  NOW()
);
```

4. Click **Go**
5. Done! Login with:
   - Email: `admin@mobileshop.com`
   - Password: `Admin@123`

### Option 2: Starting Fresh (Create tables + admin)

1. Open phpMyAdmin: Go to your phpMyAdmin URL
2. Click **SQL** tab
3. Copy the **entire contents** of `api/prisma/complete_setup.sql`
4. Paste and click **Go**
5. This creates all 10 tables AND the admin user

## Files Available

- `prisma/init.sql` - Creates all tables only
- `prisma/create_admin_simple.sql` - Creates admin user only (if tables exist)
- `prisma/complete_setup.sql` - Creates tables + admin user (complete setup)

## After Setup

1. Go to admin dashboard: http://localhost:5174
2. Login with admin credentials
3. Change password after first login!

