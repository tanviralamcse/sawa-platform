from django.test import TestCase
from .models import ProviderProfile
from users.models import User

class ProviderProfileTest(TestCase):
    def test_create_provider_profile(self):
        user = User.objects.create(username='provider1', role='provider')
        profile = ProviderProfile.objects.create(user=user, base_location='Berlin', education='BSc', years_experience=5)
        self.assertEqual(profile.user.username, 'provider1')
        self.assertEqual(profile.base_location, 'Berlin')
