import os
import sys
from django.core.wsgi import get_wsgi_application

# Set the base directory (parent of api/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Add backend directory to Python path, avoiding duplicates
backend_dir = os.path.join(BASE_DIR, 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Set environment variables
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ['VERCEL'] = '1'

# Initialize Django
import django
django.setup()

# Create the WSGI application
application = get_wsgi_application()
app = application