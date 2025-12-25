# Mobile Shop E-Commerce Platform

A complete e-commerce platform for a mobile shop with separate customer website, admin dashboard, and backend API.

## Project Structure

```
Partha/
├── api/          # Backend Express API (Node.js + TypeScript + MySQL)
├── customer/     # Customer-facing React app
├── admin/        # Admin dashboard React app
└── README.md
```

## Tech Stack

### Backend API
- Node.js + Express + TypeScript
- MySQL with Prisma ORM
- JWT Authentication
- Cloudinary for image storage

### Customer Website
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Query
- Framer Motion

### Admin Dashboard
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Query
- TanStack Table

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL Database (Hostinger)
- Cloudinary account (for image storage)

### 1. Backend API Setup

```bash
cd api
npm install

# Create .env file with the following variables:
# DATABASE_URL="mysql://u304535605_parthi:G9!nLgd7:@auth-db2109.hstgr.io:3306/u304535605_Mobileshop"
# JWT_SECRET=your_jwt_secret_key
# JWT_REFRESH_SECRET=your_refresh_secret_key
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
# PORT=5000
# CUSTOMER_URL=http://localhost:5173
# ADMIN_URL=http://localhost:5174

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

### 2. Customer Website Setup

```bash
cd customer
npm install

# Create .env file (optional):
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

The customer website will run on `http://localhost:5173`

### 3. Admin Dashboard Setup

```bash
cd admin
npm install

# Create .env file (optional):
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

The admin dashboard will run on `http://localhost:5174`

## Database Configuration

The project uses MySQL database hosted on Hostinger:

- **Host**: `auth-db2109.hstgr.io`
- **Database**: `u304535605_Mobileshop`
- **Username**: `u304535605_parthi`
- **Password**: `G9!nLgd7:`

The connection string format:
```
DATABASE_URL="mysql://u304535605_parthi:G9!nLgd7:@auth-db2109.hstgr.io:3306/u304535605_Mobileshop"
```

## Features

### Customer Website
- User registration and login
- Product browsing with filters and search
- Product details with image carousel
- Shopping cart management
- Wishlist functionality
- Checkout with Cash on Delivery
- Order history
- User profile and address management

### Admin Dashboard
- Admin authentication
- Dashboard with analytics
- Product management (CRUD)
- Order management and status updates
- User management (view, block/unblock)
- Category and brand management

### Backend API
- RESTful API endpoints
- JWT-based authentication
- Role-based access control
- Product CRUD operations
- Cart and order management
- User and admin management
- Dashboard analytics

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User/Admin login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/block` - Toggle user block status

## Development

### Running All Services

1. Start the API server:
```bash
cd api && npm run dev
```

2. Start the customer website:
```bash
cd customer && npm run dev
```

3. Start the admin dashboard:
```bash
cd admin && npm run dev
```

## Production Build

### API
```bash
cd api
npm run build
npm start
```

### Customer Website
```bash
cd customer
npm run build
# Serve the dist/ folder with a web server
```

### Admin Dashboard
```bash
cd admin
npm run build
# Serve the dist/ folder with a web server
```

## Security Notes

- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
- CORS is configured for specific origins
- Rate limiting is implemented
- Input validation on all endpoints
- Role-based access control for admin routes

## License

This project is proprietary software.

