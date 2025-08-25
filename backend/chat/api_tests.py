from django.test import TestCase, Client
from users.models import User
from .models import MessageThread, Message

class MessageApiTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create(username='msguser1', role='buyer')
        self.user2 = User.objects.create(username='msguser2', role='provider')
        self.thread = MessageThread.objects.create()
        self.thread.participants.set([self.user1, self.user2])
        self.msg = Message.objects.create(thread=self.thread, from_user=self.user1, to_user=self.user2, content='Hello')
    def test_message_detail(self):
        response = self.client.get(f'/api/messages/{self.msg.id}/')
        self.assertEqual(response.status_code, 200)
