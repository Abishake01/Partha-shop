-- Simple SQL to create admin user
-- Run this in phpMyAdmin after creating tables
-- Then manually update the password hash using the API registration endpoint

-- Step 1: Insert admin user (you'll need to update password hash later)
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
  'temp_password_will_be_updated', -- Temporary - will be updated via API
  'Admin',
  'User',
  'ADMIN',
  FALSE,
  NOW(),
  NOW()
);

-- Step 2: After running the API registration endpoint, update this user's password
-- The API will hash the password automatically

