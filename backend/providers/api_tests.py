from django.test import TestCase, Client
from users.models import User
from .models import ProviderProfile

class ProviderProfileApiTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='providerapi', role='provider')
        self.profile = ProviderProfile.objects.create(user=self.user, base_location='Berlin', education='BSc', years_experience=5)
    def test_provider_profile_detail(self):
        response = self.client.get(f'/api/providers/{self.profile.id}/')
        self.assertEqual(response.status_code, 200)
