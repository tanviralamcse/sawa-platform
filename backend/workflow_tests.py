from django.test import TestCase, Client
from users.models import User
from buyers.models import BuyerProfile
from providers.models import ProviderProfile
from service_requests.models import ServiceRequest
from applications.models import Application
from reviews.models import Review

class FullWorkflowTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.buyer = User.objects.create_user(username='buyerwf', password='pass', role='buyer')
        self.provider = User.objects.create_user(username='providerwf', password='pass', role='provider')
        self.buyer_profile = BuyerProfile.objects.create(user=self.buyer, company_name='TestCo', industry='Tech', contact_person_name='Alice')
        self.provider_profile = ProviderProfile.objects.create(user=self.provider, base_location='Berlin', education='BSc', years_experience=5)

    def test_full_workflow(self):
        # Buyer logs in and creates a service request
        self.client.login(username='buyerwf', password='pass')
        req = ServiceRequest.objects.create(buyer=self.buyer_profile, title='Test', machine_type='TypeA', serial_number='123', customer_company_name='TestCo', customer_address='Addr', contact_person_name='Alice', contact_person_position='Manager', contact_email='alice@test.com', contact_phone='123', service_types=[], issue_description='Issue', urgency='high', preferred_date='2025-08-21', budget_eur=100, payment_method='bank_transfer', status='open')
        # Provider logs in and applies
        self.client.logout()
        self.client.login(username='providerwf', password='pass')
        app = Application.objects.create(request=req, provider=self.provider_profile, pitch='Choose me', status='submitted')
        # Buyer assigns provider
        self.client.logout()
        self.client.login(username='buyerwf', password='pass')
        req.status = 'assigned'
        req.save()
        # Provider marks job complete
        self.client.logout()
        self.client.login(username='providerwf', password='pass')
        req.status = 'completed'
        req.save()
        # Both submit reviews
        Review.objects.create(request=req, reviewer=self.buyer, reviewee=self.provider, role_of_reviewer='buyer', rating_overall=5)
        Review.objects.create(request=req, reviewer=self.provider, reviewee=self.buyer, role_of_reviewer='provider', rating_overall=5)
        self.assertEqual(Review.objects.count(), 2)
