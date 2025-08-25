from django.test import TestCase, Client
from users.models import User
from buyers.models import BuyerProfile
from .models import ServiceRequest

class ServiceRequestPermissionTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.buyer = User.objects.create_user(username='buyer2', password='pass', role='buyer')
        self.provider = User.objects.create_user(username='provider2', password='pass', role='provider')
        self.buyer_profile = BuyerProfile.objects.create(user=self.buyer, company_name='TestCo', industry='Tech', contact_person_name='Alice')
        self.req = ServiceRequest.objects.create(buyer=self.buyer_profile, title='Test', machine_type='TypeA', serial_number='123', customer_company_name='TestCo', customer_address='Addr', contact_person_name='Alice', contact_person_position='Manager', contact_email='alice@test.com', contact_phone='123', service_types=[], issue_description='Issue', urgency='high', preferred_date='2025-08-21', budget_eur=100, payment_method='bank_transfer', status='draft')

    def test_buyer_can_access_own_request(self):
        self.client.login(username='buyer2', password='pass')
        response = self.client.get(f'/api/requests/{self.req.id}/')
        self.assertEqual(response.status_code, 200)

    def test_provider_cannot_access_buyer_request(self):
        self.client.login(username='provider2', password='pass')
        response = self.client.get(f'/api/requests/{self.req.id}/')
        self.assertEqual(response.status_code, 403)
