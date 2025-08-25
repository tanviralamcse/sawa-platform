from django.db import models
from users.models import User
from service_requests.models import ServiceRequest
from documents.models import Document

class MessageThread(models.Model):
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE)
    participants = models.ManyToManyField(User)
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    thread = models.ForeignKey(MessageThread, on_delete=models.CASCADE)
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    attachments = models.ManyToManyField(Document, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(blank=True, null=True)
