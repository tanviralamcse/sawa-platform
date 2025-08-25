from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'locale', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'phone']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.get('role', 'buyer')
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create appropriate profile based on role
        if role == 'buyer':
            from buyers.models import BuyerProfile
            BuyerProfile.objects.create(
                user=user,
                company_name='',  # Will be filled during onboarding
                industry='',
                contact_person_name=user.username,
            )
        elif role == 'provider':
            from providers.models import ProviderProfile
            ProviderProfile.objects.create(
                user=user,
                company_name='',  # Will be filled during onboarding
                base_location='',
                education='',
                years_experience=0,
                services_offered=[],
                hourly_rate_eur=0.00,
            )
        
        return user
