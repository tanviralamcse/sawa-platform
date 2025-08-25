from django.db import models
from providers.models import ProviderProfile
from service_requests.models import ServiceRequest

class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE)
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE)
    pitch = models.TextField()
    comments = models.TextField(blank=True)
    available_on_preferred_date = models.BooleanField(default=False)
    suggested_date = models.DateField(blank=True, null=True)
    price_adjustment_eur = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    chat_thread = models.ForeignKey('chat.MessageThread', on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
