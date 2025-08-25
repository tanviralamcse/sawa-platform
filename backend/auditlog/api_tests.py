from django.test import TestCase, Client
from users.models import User
from .models import AuditLog

class AuditLogApiTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='auditapi', role='admin')
        self.log = AuditLog.objects.create(user=self.user, action='create', entity_type='User', entity_id='1')
    def test_auditlog_detail(self):
        response = self.client.get(f'/api/auditlog/{self.log.id}/')
        self.assertEqual(response.status_code, 200)
