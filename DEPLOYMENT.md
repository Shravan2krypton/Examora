# Vercel Deployment Guide

This guide will help you deploy the Examora application to Vercel.

## Prerequisites

- Vercel account
- GitHub repository (recommended)
- Neon PostgreSQL database (recommended)
- Environment variables configured

## Step 1: Prepare Your Repository

1. Push your code to GitHub:
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## Step 2: Set Up Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will automatically detect it as a Next.js application

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

### Required Variables
```
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_key_at_least_32_characters_long
NODE_ENV=production
```

### Optional Variables
```
MAX_FILE_SIZE=10485760
UPLOAD_DIR=public/uploads/question-banks
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Step 4: Database Setup (Neon)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new database project
3. Copy the connection string to `DATABASE_URL`
4. Run database migrations if needed

## Step 5: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be live at `https://your-app-name.vercel.app`

## Step 6: Post-Deployment Setup

### File Uploads
The application uses Vercel's serverless functions for file uploads. Files are stored in the `public/uploads/question-banks` directory.

### Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Environment-Specific Configurations

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check all environment variables are set
   - Ensure dependencies are compatible
   - Verify TypeScript configuration

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible from Vercel
   - Ensure connection pooling is configured

3. **File Upload Issues**
   - Check file size limits (10MB default)
   - Verify upload directory permissions
   - Ensure API routes are properly configured

4. **Authentication Issues**
   - Verify `JWT_SECRET` is set and at least 32 characters
   - Check `NEXTAUTH_URL` matches your deployment URL
   - Ensure session cookies are configured correctly

### Performance Optimization

The application includes several optimizations:

- Image optimization with WebP/AVIF formats
- Code splitting and lazy loading
- CSS optimization
- Bundle size optimization
- Static asset caching

### Security Features

- Security headers (X-Frame-Options, CSP, etc.)
- Input validation and sanitization
- JWT-based authentication
- File upload restrictions
- Rate limiting on API endpoints

## Monitoring

Vercel provides built-in monitoring:

- Real-time logs
- Performance metrics
- Error tracking
- Build logs
- Analytics

## Scaling

The application automatically scales with Vercel:

- Serverless functions scale horizontally
- CDN for static assets
- Database connection pooling
- Edge caching

## Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs
3. Test locally with production environment
4. Contact Vercel support if needed

## Updates

To update your deployment:
1. Push changes to GitHub
2. Vercel will automatically redeploy
3. Monitor build logs for issues

## Backup Strategy

- Database: Neon provides automatic backups
- Files: Consider using Vercel Blob or external storage
- Configuration: Keep environment variables secure
