from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.http import JsonResponse
from .models import Application
from .serializers import ApplicationSerializer
from providers.models import ProviderProfile

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Application.objects.none()
        status_param = self.request.query_params.get('status')
        if self.request.user.role == 'provider':
            try:
                provider_profile = ProviderProfile.objects.get(user=self.request.user)
                queryset = Application.objects.filter(provider=provider_profile)
            except ProviderProfile.DoesNotExist:
                queryset = Application.objects.none()
        elif self.request.user.role == 'buyer':
            from buyers.models import BuyerProfile
            try:
                buyer_profile = BuyerProfile.objects.get(user=self.request.user)
                queryset = Application.objects.filter(request__buyer=buyer_profile)
            except BuyerProfile.DoesNotExist:
                queryset = Application.objects.none()
        # Apply status filter if present
        if status_param and status_param != 'all':
            queryset = queryset.filter(status=status_param)
        return queryset
    
    def create(self, request, *args, **kwargs):
        """Override create to add detailed error logging"""
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            logger.info(f"=== APPLICATION CREATION START ===")
            logger.info(f"User: {request.user}")
            logger.info(f"User role: {getattr(request.user, 'role', 'NO_ROLE')}")
            logger.info(f"Request data: {request.data}")
            
            # Check if user is authenticated
            if not request.user.is_authenticated:
                logger.error("User not authenticated")
                return Response({'detail': 'Authentication required'}, status=401)
            
            # Check user role
            if not hasattr(request.user, 'role') or request.user.role != 'provider':
                logger.error(f"Invalid user role: {getattr(request.user, 'role', 'NO_ROLE')}")
                return Response({'detail': 'Only providers can submit applications'}, status=403)
            
            # Check if provider profile exists
            try:
                provider_profile = ProviderProfile.objects.get(user=request.user)
                logger.info(f"Provider profile found: {provider_profile.id}")
            except ProviderProfile.DoesNotExist:
                logger.error("Provider profile not found")
                return Response({'detail': 'Provider profile required'}, status=400)
            
            # Create serializer
            serializer = self.get_serializer(data=request.data)
            logger.info(f"Serializer created with data: {serializer.initial_data}")
            
            # Validate serializer
            if not serializer.is_valid():
                logger.error(f"Serializer validation failed: {serializer.errors}")
                return Response(serializer.errors, status=400)
            
            logger.info("Serializer validation passed, calling perform_create")
            self.perform_create(serializer)
            
            headers = self.get_success_headers(serializer.data)
            logger.info(f"=== APPLICATION CREATION SUCCESS ===")
            return Response(serializer.data, status=201, headers=headers)
            
        except Exception as e:
            logger.error(f"=== APPLICATION CREATION ERROR ===")
            logger.error(f"Exception type: {type(e).__name__}")
            logger.error(f"Exception message: {str(e)}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            
            if isinstance(e, ValidationError):
                return Response({'detail': str(e)}, status=400)
            else:
                return Response({'detail': 'Internal server error'}, status=500)

    def perform_create(self, serializer):
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            logger.info(f"Creating application for user: {self.request.user}")
            logger.info(f"User role: {self.request.user.role}")
            
            # Verify user is a provider
            if self.request.user.role != 'provider':
                logger.error(f"User with role {self.request.user.role} tried to create application")
                raise ValidationError("Only providers can submit applications")
            
            provider_profile = ProviderProfile.objects.get(user=self.request.user)
            logger.info(f"Found provider profile: {provider_profile}")
            logger.info(f"Request data: {serializer.validated_data}")
            
            # Save the application 
            application = serializer.save(provider=provider_profile)
            logger.info(f"Application saved successfully: {application.id}")
            
            # Create notification for the buyer
            try:
                from notifications.models import Notification
                Notification.objects.create(
                    user=application.request.buyer.user,
                    type='new_application',
                    payload={
                        'application_id': application.id,
                        'request_title': application.request.title,
                        'provider_name': provider_profile.user.first_name + ' ' + provider_profile.user.last_name
                    }
                )
                logger.info("Notification created successfully")
            except Exception as e:
                logger.error(f"Failed to create notification: {e}")
                # Don't fail the application creation if notification fails
            
        except ProviderProfile.DoesNotExist:
            logger.error("Provider profile not found")
            raise ValidationError("Provider profile required to submit application")
        except Exception as e:
            logger.error(f"Error in perform_create: {e}")
            logger.error(f"Serializer errors: {serializer.errors}")
            raise
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        from notifications.models import Notification
        application = self.get_object()
        
        # Only the buyer who posted the service request can accept applications
        if request.user.role != 'buyer':
            raise PermissionDenied("Only buyers can accept applications")
        
        try:
            from buyers.models import BuyerProfile
            buyer_profile = BuyerProfile.objects.get(user=request.user)
            if application.request.buyer != buyer_profile:
                raise PermissionDenied("You can only accept applications for your own requests")
        except BuyerProfile.DoesNotExist:
            raise PermissionDenied("Buyer profile required")
        
        application.status = 'accepted'
        application.save()
        
        # Optionally update service request status
        service_request = application.request
        service_request.status = 'in_progress'
        service_request.save()
        
        # Notify provider
        Notification.objects.create(
            user=application.provider.user,
            type='application_accepted',
            payload={
                'application_id': application.id,
                'request_title': application.request.title
            }
        )
        
        return Response({'detail': 'Application accepted successfully'})
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reject(self, request, pk=None):
        from notifications.models import Notification
        application = self.get_object()
        
        # Only the buyer who posted the service request can reject applications
        if request.user.role != 'buyer':
            raise PermissionDenied("Only buyers can reject applications")
        
        try:
            from buyers.models import BuyerProfile
            buyer_profile = BuyerProfile.objects.get(user=request.user)
            if application.request.buyer != buyer_profile:
                raise PermissionDenied("You can only reject applications for your own requests")
        except BuyerProfile.DoesNotExist:
            raise PermissionDenied("Buyer profile required")
        
        application.status = 'rejected'
        application.save()
        
        # Notify provider
        Notification.objects.create(
            user=application.provider.user,
            type='application_rejected',
            payload={
                'application_id': application.id,
                'request_title': application.request.title
            }
        )
        
        return Response({'detail': 'Application rejected successfully'})
