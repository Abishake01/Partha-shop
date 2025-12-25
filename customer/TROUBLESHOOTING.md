# Troubleshooting Frontend Issues

## Error: GET http://localhost:5173/src/pages/Login.tsx net::ERR_ABORTED 500

This error occurs when the browser tries to load the TypeScript file directly instead of the compiled version.

### Solutions:

1. **Restart the Vite Dev Server**
   ```bash
   cd customer
   # Stop the current server (Ctrl+C)
   bun run dev
   ```

2. **Clear Vite Cache**
   ```bash
   cd customer
   rm -rf node_modules/.vite
   bun run dev
   ```

3. **Reinstall Dependencies** (if the above doesn't work)
   ```bash
   cd customer
   rm -rf node_modules
   bun install
   bun run dev
   ```

4. **Check for Syntax Errors**
   - Make sure all JSX tags are properly closed
   - Check for missing imports
   - Verify all components are exported correctly

5. **Check Browser Console**
   - Open browser DevTools (F12)
   - Check the Console tab for specific error messages
   - Check the Network tab to see which files are failing to load

## Common Issues:

### Missing Imports
- Make sure all imported components exist
- Check file paths are correct (case-sensitive on some systems)

### Build Errors
- Check terminal for TypeScript/ESLint errors
- Fix any syntax errors before the app can compile

### Port Already in Use
- If port 5173 is already in use, Vite will try the next available port
- Check the terminal output for the actual port number

