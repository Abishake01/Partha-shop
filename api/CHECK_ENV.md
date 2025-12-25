# Environment Variables Check

If you're getting a 500 error on login, please verify the following:

## Required Environment Variables

1. **DATABASE_URL** - Must be set correctly
   ```env
   DATABASE_URL="mysql://username:password@host:port/database"
   ```

2. **JWT_SECRET** - Must be set (not the default value)
   ```env
   JWT_SECRET=your_actual_secret_key_here
   ```

3. **JWT_REFRESH_SECRET** - Must be set (not the default value)
   ```env
   JWT_REFRESH_SECRET=your_actual_refresh_secret_key_here
   ```

## How to Generate JWT Secrets

Run these commands to generate secure secrets:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Check Your .env File

1. Make sure `api/.env` exists (copy from `api/env.template` if needed)
2. Verify all values are set correctly
3. Restart the backend server after making changes

## Common Issues

1. **Database Connection Error**: Check if your database is accessible and credentials are correct
2. **JWT Secret Error**: Make sure JWT_SECRET and JWT_REFRESH_SECRET are set to actual values (not placeholders)
3. **Missing .env file**: The .env file must be in the `api/` directory

## Test Database Connection

You can test the database connection by running:
```bash
cd api
bun run test:db
```

