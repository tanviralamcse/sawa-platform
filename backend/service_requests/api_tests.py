from django.test import TestCase, Client
from buyers.models import BuyerProfile
from .models import ServiceRequest
from users.models import User

class ServiceRequestApiTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='buyerapi2', role='buyer')
        self.buyer = BuyerProfile.objects.create(user=self.user, company_name='TestCo', industry='Tech', contact_person_name='Alice')
        self.req = ServiceRequest.objects.create(buyer=self.buyer, title='Test', machine_type='TypeA', serial_number='123', customer_company_name='TestCo', customer_address='Addr', contact_person_name='Alice', contact_person_position='Manager', contact_email='alice@test.com', contact_phone='123', service_types=[], issue_description='Issue', urgency='high', preferred_date='2025-08-21', budget_eur=100, payment_method='bank_transfer', status='draft')
    def test_service_request_detail(self):
        response = self.client.get(f'/api/requests/{self.req.id}/')
        self.assertEqual(response.status_code, 200)
