-- Run this in phpMyAdmin to check if admin user exists
-- Copy and paste into phpMyAdmin SQL tab

-- Check if admin user exists
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  is_blocked,
  created_at
FROM users 
WHERE email = 'admin@mobileshop.com';

-- If no results, create admin user:
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

-- After creating, verify again:
SELECT 
  email,
  role,
  is_blocked,
  CASE 
    WHEN role = 'ADMIN' AND is_blocked = 0 THEN '✅ Ready to use'
    WHEN role != 'ADMIN' THEN '❌ Role is not ADMIN'
    WHEN is_blocked = 1 THEN '❌ User is blocked'
    ELSE '⚠️ Check manually'
  END as status
FROM users 
WHERE email = 'admin@mobileshop.com';

