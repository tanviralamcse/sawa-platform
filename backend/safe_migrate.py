#!/usr/bin/env python
"""
Safe Data Migration Script
Handles encoding issues and migrates data step by step
"""

import os
import sys
import json
import django
from django.core.management import execute_from_command_line
from django.core import serializers
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

def setup_django():
    """Setup Django with remote database"""
    os.environ['DATABASE_URL'] = "postgresql://neondb_owner:npg_f1miNsyE7FTe@ep-curly-morning-a2gqilg5-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()

def create_clean_backup():
    """Create a clean backup excluding problematic data"""
    print("📦 Creating clean data backup...")
    
    # Switch back to local database
    if 'DATABASE_URL' in os.environ:
        del os.environ['DATABASE_URL']
    
    # Setup Django with local database first
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    
    try:
        # Create backup excluding content types and sessions (often cause encoding issues)
        execute_from_command_line([
            'manage.py', 'dumpdata', 
            '--exclude=contenttypes',
            '--exclude=sessions',
            '--exclude=admin.logentry',
            '--indent=2',
            '--output=clean_backup.json'
        ])
        print("✅ Clean backup created successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to create backup: {e}")
        return False

def migrate_remote_database():
    """Run migrations on remote database"""
    print("🔄 Running migrations on remote database...")
    
    setup_django()
    
    try:
        execute_from_command_line(['manage.py', 'migrate', '--run-syncdb'])
        print("✅ Migrations completed successfully!")
        return True
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

def load_data_to_remote():
    """Load clean data to remote database"""
    print("📊 Loading data to remote database...")
    
    setup_django()
    
    backup_file = project_root / 'clean_backup.json'
    if not backup_file.exists():
        print("❌ Clean backup file not found!")
        return False
    
    try:
        # Read the JSON file with explicit UTF-8 encoding
        with open(backup_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Save it back to ensure clean UTF-8
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        execute_from_command_line(['manage.py', 'loaddata', 'clean_backup.json'])
        print("✅ Data loaded successfully!")
        return True
    except Exception as e:
        print(f"❌ Data loading failed: {e}")
        print("ℹ️  You may need to create fresh data or migrate specific models.")
        return False

def create_superuser():
    """Create superuser on remote database"""
    print("👤 Creating superuser...")
    setup_django()
    
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Check if superuser already exists
        if User.objects.filter(is_superuser=True).exists():
            print("ℹ️  Superuser already exists, skipping creation.")
            return True
        
        execute_from_command_line(['manage.py', 'createsuperuser', '--noinput', '--username=admin', '--email=admin@example.com'])
        print("✅ Superuser created successfully!")
        print("ℹ️  Default username: admin, email: admin@example.com")
        print("⚠️  Remember to change the password after login!")
        return True
    except Exception as e:
        print(f"❌ Superuser creation failed: {e}")
        print("ℹ️  You can create one manually later.")
        return False

def main():
    print("🚀 SAWA Platform Safe Database Migration")
    print("=" * 50)
    
    # Step 1: Create clean backup
    if not create_clean_backup():
        print("❌ Failed to create backup. Aborting migration.")
        return
    
    # Step 2: Migrate remote database
    if not migrate_remote_database():
        print("❌ Failed to migrate remote database. Aborting.")
        return
    
    # Step 3: Load data
    if not load_data_to_remote():
        print("⚠️  Data loading failed, but you can still use the remote database.")
        print("ℹ️  Consider creating fresh data or migrating specific models manually.")
    
    # Step 4: Create superuser
    create_superuser()
    
    print("\n🎉 Migration process completed!")
    print("📋 Next steps:")
    print("   1. Test your remote database connection")
    print("   2. Update Vercel environment variables")
    print("   3. Deploy your application")
    print("   4. Create test data if needed")

if __name__ == '__main__':
    main()
