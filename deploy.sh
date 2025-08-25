#!/bin/bash
echo "Starting SAWA Platform deployment to Vercel..."

# Activate virtual environment (if on Linux/Mac)
if [ -f "./venv/bin/activate" ]; then
    source ./venv/bin/activate
fi

# Check if logged in to Vercel
echo "Checking Vercel authentication..."
if ! vercel whoami > /dev/null 2>&1; then
    echo "Please log in to Vercel first:"
    echo "  vercel login"
    echo "Then run this script again."
    exit 1
fi

# Build frontend first
echo "Building React frontend..."
cd frontend
npm install
npm run build
cd ..

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo ""
echo "Deployment completed!"
echo "Check your Vercel dashboard for the deployment URL."
