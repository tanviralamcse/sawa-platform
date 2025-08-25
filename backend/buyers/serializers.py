from rest_framework import serializers
from .models import BuyerProfile

class BuyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
