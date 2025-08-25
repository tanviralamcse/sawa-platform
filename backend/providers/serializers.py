from rest_framework import serializers
from .models import ProviderProfile

class ProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'average_rating', 'ratings_count']
