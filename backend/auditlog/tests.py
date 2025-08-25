from django.test import TestCase
from .models import AuditLog
from users.models import User

class AuditLogTest(TestCase):
    def test_create_auditlog(self):
        user = User.objects.create(username='audituser', role='admin')
        log = AuditLog.objects.create(user=user, action='create', entity_type='User', entity_id='1')
        self.assertEqual(log.action, 'create')
        self.assertEqual(log.entity_type, 'User')
