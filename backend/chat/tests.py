from django.test import TestCase
from .models import MessageThread, Message
from users.models import User

class MessageTest(TestCase):
    def test_create_message_thread_and_message(self):
        user1 = User.objects.create(username='user1', role='buyer')
        user2 = User.objects.create(username='user2', role='provider')
        thread = MessageThread.objects.create()
        thread.participants.set([user1, user2])
        msg = Message.objects.create(thread=thread, from_user=user1, to_user=user2, content='Hello')
        self.assertEqual(msg.content, 'Hello')
        self.assertIn(user1, thread.participants.all())
