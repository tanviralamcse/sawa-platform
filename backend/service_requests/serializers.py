from rest_framework import serializers
from .models import ServiceRequest

class ServiceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = '__all__'
        read_only_fields = ['buyer', 'created_at', 'updated_at']

    def validate_service_types(self, value):
        """Ensure service_types is a list"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Service types must be a list")
        if len(value) == 0:
            raise serializers.ValidationError("At least one service type is required")
        return value

    def validate_budget_eur(self, value):
        """Ensure budget is positive"""
        if value <= 0:
            raise serializers.ValidationError("Budget must be greater than 0")
        return value

    def validate(self, data):
        """Custom validation for the entire object"""
        # If other_service_type is provided, add it to service_types
        if 'other_service_type' in data and data['other_service_type']:
            if 'service_types' not in data:
                data['service_types'] = []
            data['service_types'].append(data['other_service_type'])
            
        # If other_requirement is provided, add it to technician_requirements
        if 'other_requirement' in data and data['other_requirement']:
            if 'technician_requirements' not in data:
                data['technician_requirements'] = []
            data['technician_requirements'].append(data['other_requirement'])
            
        return data
