from django.test import TestCase, Client
from users.models import User
from service_requests.models import ServiceRequest
from buyers.models import BuyerProfile
from .models import Review

class ReviewApiTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='reviewapi', role='buyer')
        self.user2 = User.objects.create(username='revieweeapi', role='provider')
        self.buyer = BuyerProfile.objects.create(user=self.user, company_name='TestCo', industry='Tech', contact_person_name='Alice')
        self.req = ServiceRequest.objects.create(buyer=self.buyer, title='Test', machine_type='TypeA', serial_number='123', customer_company_name='TestCo', customer_address='Addr', contact_person_name='Alice', contact_person_position='Manager', contact_email='alice@test.com', contact_phone='123', service_types=[], issue_description='Issue', urgency='high', preferred_date='2025-08-21', budget_eur=100, payment_method='bank_transfer', status='draft')
        self.review = Review.objects.create(request=self.req, reviewer=self.user, reviewee=self.user2, role_of_reviewer='buyer', rating_overall=5)
    def test_review_detail(self):
        response = self.client.get(f'/api/reviews/{self.review.id}/')
        self.assertEqual(response.status_code, 200)
