from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import ServiceRequest
from .serializers import ServiceRequestSerializer
from buyers.models import BuyerProfile
import logging

logger = logging.getLogger(__name__)

class ServiceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'buyer':
            try:
                buyer_profile = BuyerProfile.objects.get(user=self.request.user)
                return ServiceRequest.objects.filter(buyer=buyer_profile)
            except BuyerProfile.DoesNotExist:
                return ServiceRequest.objects.none()
        elif self.request.user.role == 'provider':
            return ServiceRequest.objects.filter(status__in=['open', 'in_progress'])
        return ServiceRequest.objects.none()
    
    def perform_create(self, serializer):
        try:
            buyer_profile = BuyerProfile.objects.get(user=self.request.user)
            serializer.save(buyer=buyer_profile)
        except BuyerProfile.DoesNotExist:
            raise ValidationError("Buyer profile required to create service request")
    
    def create(self, request, *args, **kwargs):
        logger.info(f"Creating service request with data: {request.data}")
        logger.info(f"User: {request.user}, Role: {getattr(request.user, 'role', 'None')}")
        
        # Check if user has buyer profile
        try:
            buyer_profile = BuyerProfile.objects.get(user=request.user)
            logger.info(f"Found buyer profile: {buyer_profile.id}")
        except BuyerProfile.DoesNotExist:
            logger.error("Buyer profile not found")
            return Response(
                {"error": "Buyer profile required to create service request"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(buyer=buyer_profile)
                headers = self.get_success_headers(serializer.data)
                logger.info("Service request created successfully")
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            except Exception as e:
                logger.error(f"Error saving service request: {str(e)}")
                return Response(
                    {"error": f"Error saving service request: {str(e)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            logger.error(f"Validation errors: {serializer.errors}")
            # Print each field error in detail
            for field, errors in serializer.errors.items():
                logger.error(f"Field '{field}': {errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
