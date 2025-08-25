#!/usr/bin/env python3
"""
Quick test script to verify frontend pages are working
"""

import requests
import json

# Test if frontend is running
def test_frontend():
    try:
        response = requests.get('http://localhost:3000')
        print(f"Frontend Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Frontend is running successfully!")
        else:
            print("❌ Frontend returned error status")
    except requests.exceptions.ConnectionError:
        print("❌ Frontend is not running on http://localhost:3000")
    except Exception as e:
        print(f"❌ Error connecting to frontend: {e}")

# Test if backend API would be accessible
def test_backend():
    try:
        response = requests.get('http://localhost:8000/api/auth/register/')
        print(f"Backend Status: {response.status_code}")
        if response.status_code in [200, 405]:  # 405 is expected for GET on POST endpoint
            print("✅ Backend API is accessible!")
        else:
            print("❌ Backend API returned unexpected status")
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error connecting to backend: {e}")

if __name__ == "__main__":
    print("🧪 Testing SAWA Application...")
    print("-" * 40)
    test_frontend()
    test_backend()
    print("-" * 40)
    print("💡 To fully test the application:")
    print("1. Start the Django backend: cd backend && python manage.py runserver")
    print("2. Frontend is already running on http://localhost:3000")
    print("3. Open browser and test registration/login")
