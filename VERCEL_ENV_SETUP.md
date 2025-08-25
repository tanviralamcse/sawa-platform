# SAWA Platform - Vercel Environment Variables Setup

## Required Environment Variables for Vercel Dashboard

Go to your Vercel dashboard → sawa-platform → Settings → Environment Variables

Add these variables for **Production** environment:

### 1. Database Configuration (from your neondb.txt)
```
DATABASE_URL = postgresql://neondb_owner:npg_f1miNsyE7FTe@ep-curly-morning-a2gqilg5-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_URL = postgresql://neondb_owner:npg_f1miNsyE7FTe@ep-curly-morning-a2gqilg5-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_USER = neondb_owner
POSTGRES_HOST = ep-curly-morning-a2gqilg5-pooler.eu-central-1.aws.neon.tech
POSTGRES_PASSWORD = npg_f1miNsyE7FTe
POSTGRES_DATABASE = neondb
```

### 2. Django Configuration
```
DJANGO_SECRET_KEY = your-secret-key-here-generate-a-new-one
DJANGO_DEBUG = False
DJANGO_SETTINGS_MODULE = config.settings
PYTHONPATH = backend
```

### 3. Security & CORS
```
ALLOWED_HOSTS = .vercel.app,.now.sh
CORS_ALLOWED_ORIGINS = https://your-app-name.vercel.app
```

## Generate Django Secret Key
Run this command to generate a secure secret key:
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Quick Setup Commands (Alternative)
If you prefer CLI, you can also set these via command line:

```bash
# Basic Django settings
vercel env add DJANGO_SECRET_KEY production
vercel env add DJANGO_DEBUG production  
vercel env add DJANGO_SETTINGS_MODULE production
vercel env add PYTHONPATH production

# Database settings
vercel env add DATABASE_URL production
vercel env add POSTGRES_URL production
vercel env add POSTGRES_USER production
vercel env add POSTGRES_HOST production  
vercel env add POSTGRES_PASSWORD production
vercel env add POSTGRES_DATABASE production

# Security settings
vercel env add ALLOWED_HOSTS production
vercel env add CORS_ALLOWED_ORIGINS production
```

## After Setting Environment Variables

1. **Deploy again:**
   ```bash
   vercel --prod
   ```

2. **Run database migrations** (after first successful deployment):
   - Go to Vercel dashboard
   - Find your deployment
   - Check function logs
   - You may need to create a migration script

## Database Migration Script
Create this file for one-time migration setup:

**migrate.py** (run locally):
```python
import os
import django
from django.core.management import execute_from_command_line

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Run migrations
execute_from_command_line(['manage.py', 'migrate'])
execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])

print("Database migration completed!")
```

## Testing Deployment
After deployment, test these URLs:
- Frontend: `https://your-app.vercel.app/`
- API: `https://your-app.vercel.app/api/`
- Admin: `https://your-app.vercel.app/admin/`

## Troubleshooting
1. **500 errors**: Check environment variables are set correctly
2. **Database errors**: Verify Neon database connection
3. **Build errors**: Check build logs in Vercel dashboard
4. **Static files**: Ensure React build completed successfully
