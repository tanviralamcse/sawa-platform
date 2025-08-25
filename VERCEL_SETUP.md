# SAWA Platform - Vercel CLI Setup & Deployment

## Step 1: Login to Vercel
```bash
vercel login
```
Choose your preferred login method (GitHub recommended).

## Step 2: Initialize Project
```bash
vercel
```
This will prompt you with questions:

### Expected Prompts & Recommended Answers:
1. **"Set up and deploy?"** → `y` (Yes)
2. **"Which scope?"** → Choose your account/team
3. **"Link to existing project?"** → `n` (No, create new)
4. **"What's your project's name?"** → `sawa-platform`
5. **"In which directory is your code located?"** → `./` (current directory)
6. **"Want to override the settings?"** → `y` (Yes)

### Override Settings:
- **Build Command:** `npm run build`
- **Output Directory:** `frontend/build`
- **Install Command:** `npm install`

## Step 3: Set Environment Variables
```bash
# Set production environment variables
vercel env add DJANGO_SECRET_KEY
vercel env add DJANGO_DEBUG
vercel env add DB_NAME
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_HOST
vercel env add DB_PORT
```

### Required Environment Variables:
```
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=False
DJANGO_SETTINGS_MODULE=config.vercel_settings
PYTHONPATH=backend
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432
```

## Step 4: Deploy
```bash
# Deploy to production
vercel --prod
```

## Step 5: Post-Deployment Setup

### 5.1 Run Database Migrations
After first deployment, run migrations:
```bash
# SSH into your deployed function or use a migration service
# You may need to set up a separate script for this
```

### 5.2 Create Superuser
```bash
# Create Django admin superuser
# This also needs to be done via a migration script or admin panel
```

## Quick Deploy Script
Run the deployment script:
```bash
# Windows
.\deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

## Vercel Dashboard Configuration

1. Go to [vercel.com](https://vercel.com)
2. Find your `sawa-platform` project
3. Go to Settings → Environment Variables
4. Add all required variables
5. Go to Settings → Functions
6. Ensure Python runtime is set to 3.9

## Troubleshooting

### Build Failures:
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in requirements.txt
3. Check that vercel.json configuration is correct

### Database Issues:
1. Ensure database is accessible from Vercel
2. Check connection strings
3. Verify environment variables are set correctly

### Static Files:
1. Ensure frontend builds successfully
2. Check static file paths in Django settings
3. Verify routing in vercel.json

## Testing Deployment

After deployment, test these URLs:
- `https://your-app.vercel.app/` (React frontend)
- `https://your-app.vercel.app/api/` (Django API)
- `https://your-app.vercel.app/admin/` (Django admin)

## Project Structure for Vercel
```
sawa/
├── backend/
│   ├── config/
│   │   ├── wsgi.py          # Vercel entry point
│   │   ├── settings.py      # Base settings
│   │   └── vercel_settings.py # Production settings
│   ├── requirements.txt     # Python dependencies
│   └── manage.py
├── frontend/
│   ├── package.json         # React dependencies
│   ├── build/              # Built React app (auto-generated)
│   └── src/
├── vercel.json             # Vercel configuration
├── package.json            # Root build configuration
└── .vercelignore          # Files to exclude
```
