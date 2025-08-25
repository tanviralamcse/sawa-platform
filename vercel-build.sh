#!/bin/bash
set -e

echo "Starting Vercel build process..."

# Build React frontend
echo "Building React frontend..."
cd frontend
npm ci --only=production
npm run build
cd ..

echo "Frontend build completed successfully!"

# Prepare Django backend
echo "Preparing Django backend..."
cd backend
pip install -r requirements.txt

# Collect static files (if needed)
python manage.py collectstatic --noinput --clear || echo "Static files collection skipped"

cd ..

echo "Build process completed successfully!"
