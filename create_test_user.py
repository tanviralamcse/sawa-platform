#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to Python path
sys.path.insert(0, r'c:\ABC\sawa\backend')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

# Check existing users
print("Existing users:")
for user in User.objects.all():
    print(f"- {user.username} ({user.email}) - Role: {user.role}")

# Create test user if doesn't exist
if not User.objects.filter(username='testuser').exists():
    print("\nCreating test user...")
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123',
        role='buyer',
        first_name='Test',
        last_name='User'
    )
    print(f"✅ Created test user: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Role: {user.role}")
else:
    print("✅ Test user already exists")

# Test authentication
from django.contrib.auth import authenticate
user = authenticate(username='testuser', password='testpass123')
if user:
    print("✅ Authentication test passed")
else:
    print("❌ Authentication test failed")
