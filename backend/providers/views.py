from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ProviderProfile
from .serializers import ProviderProfileSerializer

class ProviderProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProviderProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'provider':
            return ProviderProfile.objects.filter(user=self.request.user)
        elif self.request.user.role == 'buyer':
            return ProviderProfile.objects.all()
        return ProviderProfile.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        try:
            profile = ProviderProfile.objects.get(user=request.user)
            if request.method == 'GET':
                serializer = self.get_serializer(profile)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(profile, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data)
        except ProviderProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)
