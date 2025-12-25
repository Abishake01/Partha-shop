# API Setup Instructions

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp env.template .env
   ```

2. **Edit `.env` file and add your Cloudinary credentials:**
   - Sign up at https://cloudinary.com (free tier available)
   - Get your credentials from: https://console.cloudinary.com/settings/api-keys
   - Replace the placeholder values:
     ```
     CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
     CLOUDINARY_API_KEY=your_actual_api_key
     CLOUDINARY_API_SECRET=your_actual_api_secret
     ```

3. **Install dependencies:**
   ```bash
   bun install
   # or
   npm install
   ```

4. **Generate Prisma Client:**
   ```bash
   bun run prisma:generate
   # or
   npm run prisma:generate
   ```

5. **Run database migrations:**
   ```bash
   bun run prisma:migrate
   # or
   npm run prisma:migrate
   ```

6. **Start the server:**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

## Important Notes

- The database connection string is already configured with your Hostinger credentials
- JWT secrets are set to default values - **change these in production!**
- Cloudinary is required for image uploads. You can use the free tier for development.

## For Production

Generate strong JWT secrets:
```bash
# On Linux/Mac:
openssl rand -base64 32

# Or use an online generator:
# https://randomkeygen.com/
```

Replace `JWT_SECRET` and `JWT_REFRESH_SECRET` with strong random strings.

