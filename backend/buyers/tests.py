from django.test import TestCase
from .models import BuyerProfile
from users.models import User

class BuyerProfileTest(TestCase):
    def test_create_buyer_profile(self):
        user = User.objects.create(username='buyer1', role='buyer')
        profile = BuyerProfile.objects.create(user=user, company_name='TestCo', industry='Tech', contact_person_name='Alice')
        self.assertEqual(profile.user.username, 'buyer1')
        self.assertEqual(profile.company_name, 'TestCo')
