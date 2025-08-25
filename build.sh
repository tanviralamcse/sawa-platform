#!/bin/bash

# Install frontend dependencies and build
cd frontend
npm ci
npm run build

# Move build files to root for Vercel
cd ..
cp -r frontend/build/* .

# Install backend dependencies
cd backend
pip install -r requirements.txt

echo "Build completed successfully!"
