from django.test import TestCase
from buyers.models import BuyerProfile
from .models import ServiceRequest

class ServiceRequestModelTest(TestCase):
    def test_create_service_request(self):
        # Minimal buyer profile for FK
        user = BuyerProfile.objects.create(company_name='TestCo', industry='Tech', contact_person_name='Alice')
        req = ServiceRequest.objects.create(buyer=user, title='Test', machine_type='TypeA', serial_number='123', customer_company_name='TestCo', customer_address='Addr', contact_person_name='Alice', contact_person_position='Manager', contact_email='alice@test.com', contact_phone='123', service_types=[], issue_description='Issue', urgency='high', preferred_date='2025-08-21', budget_eur=100, payment_method='bank_transfer', status='draft')
        self.assertEqual(req.title, 'Test')
        self.assertEqual(req.status, 'draft')
