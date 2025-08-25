from django.test import TestCase, Client
from users.models import User
from .models import Notification

class NotificationApiTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='notifapi', role='buyer')
        self.notif = Notification.objects.create(user=self.user, type='info', payload={})
    def test_notification_detail(self):
        response = self.client.get(f'/api/notifications/{self.notif.id}/')
        self.assertEqual(response.status_code, 200)
