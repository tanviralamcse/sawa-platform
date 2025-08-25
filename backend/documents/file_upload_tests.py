from django.test import TestCase, Client
from users.models import User
from .models import Document
from django.core.files.uploadedfile import SimpleUploadedFile

class DocumentUploadAccessTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='docuser', password='pass', role='buyer')
        self.client.login(username='docuser', password='pass')

    def test_file_upload(self):
        file = SimpleUploadedFile('test.pdf', b'filecontent', content_type='application/pdf')
        response = self.client.post('/api/documents/', {'file': file, 'type': 'manual', 'file_name': 'test.pdf', 'mime_type': 'application/pdf', 'size_bytes': 11, 'access_scope': 'owner'})
        self.assertIn(response.status_code, [200, 201])

    def test_document_access(self):
        doc = Document.objects.create(owner_user=self.user, type='manual', file_key='key', file_name='file.pdf', mime_type='application/pdf', size_bytes=1234, access_scope='owner')
        response = self.client.get(f'/api/documents/{doc.id}/')
        self.assertEqual(response.status_code, 200)
