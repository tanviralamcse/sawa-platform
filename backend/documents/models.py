from django.db import models
from users.models import User
from service_requests.models import ServiceRequest
from providers.models import ProviderProfile

class Document(models.Model):
    owner_user = models.ForeignKey(User, on_delete=models.CASCADE)
    request = models.ForeignKey(ServiceRequest, on_delete=models.SET_NULL, null=True, blank=True)
    provider_profile = models.ForeignKey(ProviderProfile, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.CharField(max_length=50)
    file_key = models.CharField(max_length=255)
    file_name = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=50)
    size_bytes = models.IntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    access_scope = models.CharField(max_length=20)
