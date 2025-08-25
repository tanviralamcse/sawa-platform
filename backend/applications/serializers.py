from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    # Include service request details (read-only)
    request_title = serializers.CharField(source='request.title', read_only=True)
    request_budget = serializers.DecimalField(source='request.budget_eur', max_digits=10, decimal_places=2, read_only=True)
    request_preferred_date = serializers.DateField(source='request.preferred_date', read_only=True)
    request_customer_address = serializers.CharField(source='request.customer_address', read_only=True)
    request_machine_type = serializers.CharField(source='request.machine_type', read_only=True)
    
    # Include nested request object for complete data
    request_data = serializers.SerializerMethodField()
    
    # Include chat thread ID for interview
    chat_thread_id = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['provider', 'created_at', 'updated_at', 'chat_thread']
    
    def get_request_data(self, obj):
        # Add safety check to prevent errors during creation
        if not obj or not hasattr(obj, 'request') or not obj.request:
            return None
        try:
            return {
                'id': obj.request.id,
                'title': obj.request.title,
                'budget_eur': float(obj.request.budget_eur),
                'preferred_date': obj.request.preferred_date,
                'customer_address': obj.request.customer_address,
                'machine_type': obj.request.machine_type,
                'issue_description': obj.request.issue_description,
            }
        except Exception:
            return None
    
    def get_chat_thread_id(self, obj):
        # Add safety check
        if not obj or not hasattr(obj, 'chat_thread'):
            return None
        return obj.chat_thread.id if obj.chat_thread else None
