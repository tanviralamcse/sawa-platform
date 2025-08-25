from django.test import TestCase, Client
from users.models import User
from .models import BuyerProfile

class BuyerProfileApiTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='buyerapi', role='buyer')
        self.profile = BuyerProfile.objects.create(user=self.user, company_name='TestCo', industry='Tech', contact_person_name='Alice')
    def test_buyer_profile_detail(self):
        response = self.client.get(f'/api/buyers/{self.profile.id}/')
        self.assertEqual(response.status_code, 200)
