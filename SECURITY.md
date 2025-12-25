# Security Guidelines

## Important: Never Commit Sensitive Data

This repository should **NEVER** contain:
- Database passwords
- API keys
- JWT secrets
- Cloudinary credentials
- Any other sensitive credentials

## Files to Keep Secure

### Always Excluded (in .gitignore)
- `.env` files
- `*.env` files
- `.env.local` files
- Any file containing actual credentials

### Template Files (Safe to Commit)
- `env.template` - Contains placeholders only
- `*.example` files - Example configurations

## Setup Instructions

1. **Copy template files:**
   ```bash
   cp api/env.template api/.env
   ```

2. **Add your actual credentials to .env:**
   - Database connection string
   - JWT secrets (generate strong random strings)
   - Cloudinary credentials
   - Other API keys

3. **Verify .env is in .gitignore:**
   ```bash
   git check-ignore api/.env
   # Should output: api/.env
   ```

## Generating Secure Secrets

### JWT Secrets
```bash
# Linux/Mac
openssl rand -base64 32

# Or use online generator
# https://randomkeygen.com/
```

### Database Passwords
- Use strong passwords (12+ characters)
- Include uppercase, lowercase, numbers, special characters
- URL-encode special characters in connection strings

## If Credentials Are Exposed

If you accidentally commit credentials:

1. **Immediately rotate/change:**
   - Database passwords
   - API keys
   - JWT secrets
   - Any exposed credentials

2. **Remove from Git history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/file" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Force push (if already pushed):**
   ```bash
   git push origin --force --all
   ```

## Best Practices

- ✅ Use `.env` files for local development
- ✅ Use environment variables in production
- ✅ Keep `.env` in `.gitignore`
- ✅ Use template files with placeholders
- ✅ Rotate secrets regularly
- ❌ Never commit `.env` files
- ❌ Never hardcode credentials
- ❌ Never share credentials in documentation

