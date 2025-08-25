from django.test import TestCase
from .models import Review
from users.models import User
from service_requests.models import ServiceRequest
from buyers.models import BuyerProfile

class ReviewTest(TestCase):
    def test_create_review(self):
        user = User.objects.create(username='reviewer', role='buyer')
        user2 = User.objects.create(username='reviewee', role='provider')
        buyer = BuyerProfile.objects.create(user=user, company_name='TestCo', industry='Tech', contact_person_name='Alice')
        req = ServiceRequest.objects.create(buyer=buyer, title='Test', machine_type='TypeA', serial_number='123', customer_company_name='TestCo', customer_address='Addr', contact_person_name='Alice', contact_person_position='Manager', contact_email='alice@test.com', contact_phone='123', service_types=[], issue_description='Issue', urgency='high', preferred_date='2025-08-21', budget_eur=100, payment_method='bank_transfer', status='draft')
        review = Review.objects.create(request=req, reviewer=user, reviewee=user2, role_of_reviewer='buyer', rating_overall=5)
        self.assertEqual(review.rating_overall, 5)
        self.assertEqual(review.role_of_reviewer, 'buyer')
