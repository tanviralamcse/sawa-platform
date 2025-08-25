import requests
import json

# Test if backend is running
try:
    response = requests.get('http://localhost:8000/admin/')
    print(f"Backend status: {response.status_code}")
except Exception as e:
    print(f"Backend not accessible: {e}")

# Test login endpoint
try:
    login_data = {
        "username": "testuser",
        "password": "testpass123"
    }
    
    response = requests.post(
        'http://localhost:8000/api/auth/login/',
        json=login_data,
        headers={'Content-Type': 'application/json'}
    )
    
    print(f"Login response status: {response.status_code}")
    print(f"Login response: {response.text}")
    
except Exception as e:
    print(f"Login test failed: {e}")

# Check if we have any users
try:
    import os
    import django
    import sys
    
    # Add the backend directory to the path
    sys.path.append(r'c:\ABC\sawa\backend')
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    
    from users.models import User
    
    users = User.objects.all()
    print(f"\nUsers in database: {users.count()}")
    
    for user in users:
        print(f"- {user.username} ({user.email}) - Role: {user.role}")
    
    # Create test user if not exists
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
        print(f"Created user: {user.username}")
    else:
        print("Test user already exists")
        
except Exception as e:
    print(f"Database check failed: {e}")
