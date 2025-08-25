from django.test import TestCase, Client
from providers.models import ProviderProfile
from service_requests.models import ServiceRequest
from buyers.models import BuyerProfile
from users.models import User
from .models import Application

class ApplicationApiTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='buyerapi3', role='buyer')
        self.buyer = BuyerProfile.objects.create(user=self.user, company_name='TestCo', industry='Tech', contact_person_name='Alice')
        self.req = ServiceRequest.objects.create(buyer=self.buyer, title='Test', machine_type='TypeA', serial_number='123', customer_company_name='TestCo', customer_address='Addr', contact_person_name='Alice', contact_person_position='Manager', contact_email='alice@test.com', contact_phone='123', service_types=[], issue_description='Issue', urgency='high', preferred_date='2025-08-21', budget_eur=100, payment_method='bank_transfer', status='draft')
        self.user2 = User.objects.create(username='providerapi3', role='provider')
        self.provider = ProviderProfile.objects.create(user=self.user2, base_location='Berlin', education='BSc', years_experience=5)
        self.app = Application.objects.create(request=self.req, provider=self.provider, pitch='Choose me', status='submitted')
    def test_application_detail(self):
        response = self.client.get(f'/api/applications/{self.app.id}/')
        self.assertEqual(response.status_code, 200)
