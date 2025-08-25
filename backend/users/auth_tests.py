from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

class AuthPermissionTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.buyer = User.objects.create_user(username='buyer', password='pass', role='buyer')
        self.provider = User.objects.create_user(username='provider', password='pass', role='provider')
        self.admin = User.objects.create_user(username='admin', password='pass', role='admin', is_staff=True)

    def test_login(self):
        logged_in = self.client.login(username='buyer', password='pass')
        self.assertTrue(logged_in)

    def test_protected_endpoint_requires_auth(self):
        response = self.client.get('/api/buyers/')
        self.assertEqual(response.status_code, 403)

    def test_admin_access(self):
        self.client.login(username='admin', password='pass')
        response = self.client.get('/api/admin/users/')
        self.assertNotEqual(response.status_code, 403)
