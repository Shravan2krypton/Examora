# Database Setup Instructions

## Issue: DATABASE_URL Environment Variable Missing

The application is trying to connect to the database but the `DATABASE_URL` environment variable is not set.

## Solution Options:

### Option 1: Set Up Neon Database (Recommended)

1. **Create a Neon Database:**
   - Go to [https://neon.tech](https://neon.tech)
   - Sign up for a free account
   - Create a new project
   - Copy the connection string

2. **Update Environment Variables:**
   - Copy `.env.example` to `.env` (if not already exists)
   - Add your Neon connection string:
   ```
   DATABASE_URL="postgres://user:password@ep-your-project.us-east-2.aws.neon.tech/neondb"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

### Option 2: Use Local Database (Development Only)

If you prefer to use a local PostgreSQL database:

1. **Install PostgreSQL** on your system
2. **Create a database:**
   ```sql
   CREATE DATABASE examora;
   ```
3. **Update .env file:**
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/examora"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

### Option 3: Disable Database (Temporary - UI Only)

If you want to run the UI without database functionality:

1. **Comment out database imports** in files that use the database
2. **Use mock data** for demonstration purposes

## Quick Fix for UI Testing

To get the UI running immediately without database setup:

1. Create a mock database file:
```typescript
// lib/mockDb.ts
export const mockDb = {
  // Add mock data here
};
```

2. Update imports to use mock data instead of real database

## After Setup

Once you've set up the database:

1. **Run database migrations:**
   ```bash
   npm run db:push
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

## Notes

- The JWT_SECRET should be a long, random string for production
- Keep your .env file secure and never commit it to version control
- The Neon free tier is sufficient for development and small projects
