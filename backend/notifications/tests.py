from django.test import TestCase
from .models import Notification
from users.models import User

class NotificationTest(TestCase):
    def test_create_notification(self):
        user = User.objects.create(username='notifyuser', role='buyer')
        notif = Notification.objects.create(user=user, type='info', payload={})
        self.assertEqual(notif.type, 'info')
        self.assertEqual(notif.user.username, 'notifyuser')
