from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MessageThread, Message
from .serializers import MessageThreadSerializer, MessageSerializer

class MessageThreadViewSet(viewsets.ModelViewSet):
    serializer_class = MessageThreadSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MessageThread.objects.filter(participants=self.request.user)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        thread = self.get_object()
        messages = Message.objects.filter(thread=thread).order_by('created_at')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def messages(self, request, pk=None):
        thread = self.get_object()
        
        # Determine the recipient (the other participant)
        participants = thread.participants.all()
        to_user = None
        for participant in participants:
            if participant != request.user:
                to_user = participant
                break
        
        if not to_user:
            return Response({'error': 'No recipient found'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the message
        message_data = request.data.copy()
        message_data['thread'] = thread.id
        message_data['to_user'] = to_user.id
        
        serializer = MessageSerializer(data=message_data)
        if serializer.is_valid():
            serializer.save(from_user=request.user, thread=thread, to_user=to_user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Message.objects.filter(
            thread__participants=self.request.user
        ).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(from_user=self.request.user)
