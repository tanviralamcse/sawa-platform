#!/usr/bin/env python
"""
Database Migration Script
This script migrates data from local SQLite to remote Neon PostgreSQL database
"""

import os
import sys
import django
from django.core.management import execute_from_command_line
from django.core.management.base import BaseCommand
from django.conf import settings
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

def migrate_to_remote():
    """Migrate database to remote Neon PostgreSQL"""
    
    print("🔄 Starting database migration to remote Neon database...")
    
    # Load environment variables for remote database
    env_file = project_root / '.env.remote'
    if env_file.exists():
        print(f"📁 Loading environment from {env_file}")
        from dotenv import load_dotenv
        load_dotenv(env_file)
    else:
        print("⚠️  .env.remote file not found. Using default environment variables.")
    
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    
    print("🔍 Checking remote database connection...")
    
    # Test database connection
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✅ Remote database connection successful!")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
    
    print("🗃️  Running migrations on remote database...")
    
    # Run migrations
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations completed successfully!")
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    
    print("📊 Loading data from backup...")
    
    # Load data from backup
    try:
        backup_file = project_root / 'data_backup.json'
        if backup_file.exists():
            execute_from_command_line(['manage.py', 'loaddata', str(backup_file)])
            print("✅ Data loaded successfully!")
        else:
            print("⚠️  No data backup file found. Skipping data import.")
    except Exception as e:
        print(f"❌ Data loading failed: {e}")
        print("ℹ️  You may need to load data manually or create fresh data.")
        return False
    
    print("🎉 Database migration completed successfully!")
    print("📋 Next steps:")
    print("   1. Verify data in your remote database")
    print("   2. Update environment variables in Vercel dashboard")
    print("   3. Deploy your application")
    
    return True

def create_superuser():
    """Create a superuser for the remote database"""
    print("👤 Creating superuser for remote database...")
    try:
        execute_from_command_line(['manage.py', 'createsuperuser'])
        print("✅ Superuser created successfully!")
    except Exception as e:
        print(f"❌ Superuser creation failed: {e}")

if __name__ == '__main__':
    print("🚀 SAWA Platform Database Migration Tool")
    print("=" * 50)
    
    if len(sys.argv) > 1 and sys.argv[1] == 'createsuperuser':
        # Load environment for remote database
        env_file = project_root / '.env.remote'
        if env_file.exists():
            from dotenv import load_dotenv
            load_dotenv(env_file)
        
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
        django.setup()
        create_superuser()
    else:
        success = migrate_to_remote()
        
        if success:
            print("\n🔐 Do you want to create a superuser for the remote database? (y/n): ", end="")
            try:
                response = input().lower().strip()
                if response in ['y', 'yes']:
                    create_superuser()
            except KeyboardInterrupt:
                print("\n👋 Migration completed. You can create a superuser later using:")
                print("   python migrate_db.py createsuperuser")
