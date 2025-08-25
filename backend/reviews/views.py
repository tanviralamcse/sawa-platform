from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Review.objects.filter(
            models.Q(reviewer=self.request.user) | 
            models.Q(reviewee=self.request.user)
        )
    
    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)
    
    @action(detail=False, methods=['get'])
    def user(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            reviews = Review.objects.filter(reviewee_id=user_id)
            serializer = self.get_serializer(reviews, many=True)
            return Response(serializer.data)
        return Response({'error': 'user_id parameter required'}, status=400)
