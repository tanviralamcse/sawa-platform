from django.db import models
from users.models import User

class ProviderProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    base_location = models.CharField(max_length=255)
    countries = models.JSONField(default=list)
    operating_regions = models.JSONField(default=list)
    education = models.CharField(max_length=255)
    years_experience = models.IntegerField()
    certifications = models.JSONField(default=list)
    tech_skills = models.JSONField(default=list)
    services_offered = models.JSONField(default=list)
    hourly_rate_eur = models.DecimalField(max_digits=8, decimal_places=2)
    average_rating = models.FloatField(default=0)
    ratings_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
