from django.test import TestCase
from .models import Document
from users.models import User

class DocumentTest(TestCase):
    def test_create_document(self):
        user = User.objects.create(username='docuser', role='buyer')
        doc = Document.objects.create(owner_user=user, type='manual', file_key='key', file_name='file.pdf', mime_type='application/pdf', size_bytes=1234, access_scope='owner')
        self.assertEqual(doc.file_name, 'file.pdf')
        self.assertEqual(doc.type, 'manual')
