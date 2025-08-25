from rest_framework import serializers
from .models import MessageThread, Message

class MessageThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageThread
        fields = '__all__'
        read_only_fields = ['created_at']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ['from_user', 'created_at', 'read_at']
