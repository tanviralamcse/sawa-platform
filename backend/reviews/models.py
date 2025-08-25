from django.db import models
from users.models import User
from service_requests.models import ServiceRequest

class Review(models.Model):
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_given')
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_received')
    role_of_reviewer = models.CharField(max_length=20)
    metrics = models.JSONField(default=dict)
    rating_overall = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
