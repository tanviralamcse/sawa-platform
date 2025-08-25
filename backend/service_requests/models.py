from django.db import models
from buyers.models import BuyerProfile

class ServiceRequest(models.Model):
    buyer = models.ForeignKey(BuyerProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    machine_type = models.CharField(max_length=255)
    serial_number = models.CharField(max_length=100)
    locations = models.JSONField(default=list, blank=True)
    customer_company_name = models.CharField(max_length=255)
    customer_address = models.TextField()
    contact_person_name = models.CharField(max_length=100)
    contact_person_position = models.CharField(max_length=100, blank=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    service_types = models.JSONField(default=list)
    has_maintenance_history = models.BooleanField(default=False)
    history_notes = models.TextField(blank=True)
    issue_description = models.TextField()
    technician_requirements = models.JSONField(default=list, blank=True)
    safety_requirements = models.JSONField(default=list, blank=True)
    urgency = models.CharField(max_length=50)
    preferred_date = models.DateField()
    alternative_dates = models.JSONField(default=list, blank=True)
    budget_eur = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=20, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
