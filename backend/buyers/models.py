from django.db import models
from users.models import User

class BuyerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    locations = models.JSONField(default=list)
    contact_person_name = models.CharField(max_length=100)
    contact_person_position = models.CharField(max_length=100)
    company_size = models.CharField(max_length=50)
    machines = models.JSONField(default=list)
    optional_service_requirements = models.JSONField(default=list)
    qualifications_needed = models.JSONField(default=list)
    safety_requirements = models.JSONField(default=list)
    additional_info = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
