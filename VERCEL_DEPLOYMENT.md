# SAWA Platform - Vercel Deployment Guide

## Overview
This configuration deploys the SAWA platform (Django backend + React frontend) to Vercel using a monorepo structure.

## Project Structure
```
sawa/
├── backend/          # Django API
├── frontend/         # React application  
├── vercel.json       # Vercel configuration
├── package.json      # Root package.json for build
└── .vercelignore     # Files to exclude from deployment
```

## Deployment Steps

### 1. Prerequisites
- Vercel account
- PostgreSQL database (recommend: Vercel Postgres, Supabase, or Neon)
- Environment variables configured

### 2. Environment Variables
Set these in your Vercel dashboard:

```bash
# Django Configuration
DJANGO_SETTINGS_MODULE=config.vercel_settings
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=False
PYTHONPATH=backend

# Database Configuration  
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432

# CORS Configuration
ALLOWED_HOSTS=.vercel.app,.now.sh
```

### 3. Database Setup
1. Create a PostgreSQL database
2. Run migrations after first deployment:
   ```bash
   python backend/manage.py migrate
   python backend/manage.py createsuperuser
   ```

### 4. Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Deploy!

## Configuration Details

### vercel.json Features:
- **Dual builds**: Django backend + React frontend
- **Smart routing**: API calls go to Django, everything else to React
- **Static file handling**: Proper serving of CSS, JS, images
- **CORS configuration**: Cross-origin requests handled
- **Environment variables**: Production-ready settings

### Routing:
- `/api/*` → Django backend
- `/admin/*` → Django admin
- `/static/*` → Static files
- `/media/*` → Media files  
- `/*` → React frontend (with SPA fallback)

## Post-Deployment Checklist

1. ✅ Verify API endpoints work: `https://your-app.vercel.app/api/`
2. ✅ Check React app loads: `https://your-app.vercel.app/`
3. ✅ Test authentication flow
4. ✅ Verify file uploads work
5. ✅ Check admin panel: `https://your-app.vercel.app/admin/`

## Troubleshooting

### Common Issues:
1. **Build failures**: Check logs in Vercel dashboard
2. **Database connection**: Verify environment variables
3. **Static files**: Ensure paths are correct in settings
4. **CORS errors**: Update CORS_ALLOWED_ORIGINS

### Debug Mode:
To enable debug logging, set `DJANGO_DEBUG=True` temporarily.

## Local Development vs Production

### Local:
- Uses local SQLite database
- Debug mode enabled
- CORS allows all origins

### Production (Vercel):
- PostgreSQL database required
- Debug mode disabled
- Restricted CORS origins
- Static files served by Vercel

## Scaling Considerations
- **Database**: Use connection pooling for high traffic
- **Static files**: Consider CDN for large media files
- **Caching**: Redis can be added for session/cache storage
- **Monitoring**: Set up error tracking (Sentry recommended)

## Security Notes
- All sensitive data in environment variables
- HTTPS enforced in production
- CORS properly configured
- Django security middleware enabled
