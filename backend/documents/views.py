from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from .models import Document
from .serializers import DocumentSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Document.objects.filter(owner_user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner_user=self.request.user)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        document = self.get_object()
        # In production, this would serve from S3 or file storage
        response = HttpResponse(content_type=document.mime_type)
        response['Content-Disposition'] = f'attachment; filename="{document.file_name}"'
        return response
