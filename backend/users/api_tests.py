from django.test import TestCase, Client
from django.urls import reverse
from .models import User

class UserApiTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='apiuser', role='buyer')
    def test_user_list(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 200)
