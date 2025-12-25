-- Create Admin User
-- Default credentials:
-- Email: admin@mobileshop.com
-- Password: Admin@123

-- Run this SQL in phpMyAdmin to create the admin user

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
) ON DUPLICATE KEY UPDATE `email` = `email`;

