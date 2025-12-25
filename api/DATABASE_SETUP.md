# Database Setup Instructions

## Option 1: Using phpMyAdmin (Recommended if Prisma migration fails)

1. **Open phpMyAdmin**: Go to https://auth-db2109.hstgr.io/index.php?db=u304535605_Mobileshop

2. **Select your database**: Make sure `u304535605_Mobileshop` is selected

3. **Open SQL tab**: Click on the "SQL" tab in phpMyAdmin

4. **Run the SQL script**: 
   - Copy the entire contents of `prisma/init.sql`
   - Paste it into the SQL query box
   - Click "Go" to execute

5. **Verify tables**: You should see these tables created:
   - users
   - categories
   - brands
   - products
   - cart_items
   - addresses
   - orders
   - order_items
   - wishlist_items
   - reviews

## Option 2: Fix Prisma Connection

If you want to use Prisma migrations, verify your database credentials:

1. **Check credentials in Hostinger**:
   - Database name: `u304535605_Mobileshop`
   - Username: `u304535605_parthi`
   - Password: `G9!nLgd7:`
   - Host: `auth-db2109.hstgr.io`

2. **Test connection manually**:
   ```bash
   mysql -h auth-db2109.hstgr.io -u u304535605_parthi -p u304535605_Mobileshop
   # Enter password: G9!nLgd7:
   ```

3. **If connection works, try Prisma again**:
   ```bash
   cd api
   bun run prisma migrate dev --name init
   ```

## After Tables Are Created

Once tables are created (either method), run:

```bash
cd api
bun run prisma:generate
bun run dev
```

This will generate the Prisma Client and start your server.

