# Database Migration Guide - Local to Remote Neon DB

## Overview
This guide will help you migrate your local SQLite database to the remote Neon PostgreSQL database.

## Prerequisites
✅ Local database with data (`db.sqlite3` - 299KB)
✅ Data backup created (`data_backup.json` - 26KB)
✅ Neon database credentials configured
✅ Django settings updated for remote database support

## Step 1: Test Remote Database Connection

First, let's test if we can connect to the remote database:

```bash
# Set environment variable for remote database
$env:DATABASE_URL="postgresql://neondb_owner:npg_f1miNsyE7FTe@ep-curly-morning-a2gqilg5-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Test connection
python manage.py dbshell --settings=config.settings
```

## Step 2: Run Database Migration

Use the automated migration script:

```bash
# Run the migration script
python migrate_db.py
```

This script will:
1. Connect to the remote Neon database
2. Run all Django migrations 
3. Load your local data from `data_backup.json`
4. Optionally create a superuser

## Step 3: Manual Migration (Alternative)

If the script doesn't work, you can run these commands manually:

```bash
# Set environment variable
$env:DATABASE_URL="postgresql://neondb_owner:npg_f1miNsyE7FTe@ep-curly-morning-a2gqilg5-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Run migrations
python manage.py migrate

# Load data
python manage.py loaddata data_backup.json

# Create superuser
python manage.py createsuperuser
```

## Step 4: Verify Migration

Check if the migration was successful:

```bash
# Connect to remote database shell
python manage.py dbshell

# In the PostgreSQL shell, run:
# \dt  (list tables)
# SELECT COUNT(*) FROM auth_user;  (check user count)
# SELECT COUNT(*) FROM service_requests_servicerequest;  (check requests)
# \q  (quit)
```

## Step 5: Update Vercel Environment Variables

Go to Vercel Dashboard → sawa-platform → Settings → Environment Variables and add:

```
DATABASE_URL = postgresql://neondb_owner:npg_f1miNsyE7FTe@ep-curly-morning-a2gqilg5-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
DJANGO_SECRET_KEY = (generate a new one)
DJANGO_DEBUG = False
ALLOWED_HOSTS = .vercel.app,.now.sh
CORS_ALLOWED_ORIGINS = https://sawa-platform-9vg4d19lf-tanvirs-projects-19ee2d72.vercel.app
```

## Step 6: Deploy to Vercel

```bash
# Return to project root
cd ..

# Deploy with new database configuration
vercel --prod
```

## Troubleshooting

### Connection Issues
- Verify network connectivity to Neon database
- Check if the database URL is correct
- Ensure SSL is properly configured

### Migration Errors
- Check Django logs for specific error messages
- Ensure all app models are properly registered
- Verify foreign key relationships

### Data Loading Issues
- Check if the data backup file is valid JSON
- Some data might need to be loaded in specific order
- Consider loading data app by app if needed

### Vercel Deployment Issues
- Verify all environment variables are set correctly
- Check build logs for any missing dependencies
- Ensure psycopg2-binary is in requirements.txt

## Commands Summary

```bash
# Quick migration
python migrate_db.py

# Manual migration
$env:DATABASE_URL="postgresql://neondb_owner:npg_f1miNsyE7FTe@ep-curly-morning-a2gqilg5-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
python manage.py migrate
python manage.py loaddata data_backup.json
python manage.py createsuperuser

# Deploy
cd ..
vercel --prod
```

## Files Created/Modified

- ✅ `config/settings.py` - Updated for environment-based database configuration
- ✅ `requirements.txt` - Added dj-database-url
- ✅ `.env.remote` - Remote database environment variables
- ✅ `migrate_db.py` - Automated migration script
- ✅ `data_backup.json` - Local database backup (26KB)
