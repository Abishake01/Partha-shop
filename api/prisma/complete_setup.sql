-- Complete Database Setup Script
-- This creates ALL tables AND the admin user
-- Run this in phpMyAdmin SQL tab if you want to start fresh

-- ============================================
-- STEP 1: CREATE ALL TABLES
-- ============================================

-- Create Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20),
  `role` ENUM('USER', 'ADMIN') DEFAULT 'USER',
  `is_blocked` BOOLEAN DEFAULT FALSE,
  `refresh_token` TEXT,
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) UNIQUE NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `description` TEXT,
  `image` VARCHAR(500),
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Brands table
CREATE TABLE IF NOT EXISTS `brands` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) UNIQUE NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `description` TEXT,
  `image` VARCHAR(500),
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `discount_price` DECIMAL(10, 2),
  `stock` INT DEFAULT 0,
  `images` TEXT NOT NULL,
  `specifications` JSON,
  `rating` DECIMAL(3, 2) DEFAULT 0.00,
  `review_count` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `category_id` VARCHAR(36) NOT NULL,
  `brand_id` VARCHAR(36) NOT NULL,
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_category_id` (`category_id`),
  INDEX `idx_brand_id` (`brand_id`),
  INDEX `idx_slug` (`slug`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Cart Items table
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `quantity` INT DEFAULT 1,
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY `unique_user_product` (`user_id`, `product_id`),
  INDEX `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Addresses table
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address_line1` VARCHAR(500) NOT NULL,
  `address_line2` VARCHAR(500),
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `country` VARCHAR(100) DEFAULT 'India',
  `is_default` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Orders table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `address_id` VARCHAR(36) NOT NULL,
  `order_number` VARCHAR(255) UNIQUE NOT NULL,
  `status` ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
  `payment_method` VARCHAR(50) DEFAULT 'COD',
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_order_number` (`order_number`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Order Items table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` VARCHAR(36) PRIMARY KEY,
  `order_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `idx_order_id` (`order_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Wishlist Items table
CREATE TABLE IF NOT EXISTS `wishlist_items` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY `unique_user_product` (`user_id`, `product_id`),
  INDEX `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Reviews table
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(36) PRIMARY KEY,
  `product_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT,
  `created_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY `unique_product_user` (`product_id`, `user_id`),
  INDEX `idx_product_id` (`product_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- STEP 2: CREATE ADMIN USER
-- ============================================

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

-- ============================================
-- DONE! 
-- ============================================
-- Admin Login Credentials:
-- Email: admin@mobileshop.com
-- Password: Admin@123
-- ============================================

