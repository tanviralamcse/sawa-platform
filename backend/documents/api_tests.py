from django.test import TestCase, Client
from users.models import User
from .models import Document

class DocumentApiTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='docapi', role='buyer')
        self.doc = Document.objects.create(owner_user=self.user, type='manual', file_key='key', file_name='file.pdf', mime_type='application/pdf', size_bytes=1234, access_scope='owner')
    def test_document_detail(self):
        response = self.client.get(f'/api/documents/{self.doc.id}/')
        self.assertEqual(response.status_code, 200)
