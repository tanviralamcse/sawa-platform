from rest_framework import status, generics, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView as BaseTokenRefreshView
from django.contrib.auth import authenticate
from django.db.models import Count, Q
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not user.check_password(old_password):
            return Response(
                {'error': 'Current password is incorrect'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(new_password) < 6:
            return Response(
                {'error': 'New password must be at least 6 characters long'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        
        return Response({'detail': 'Password changed successfully'})

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Initialize stats
        stats = {
            'requests': 0,
            'applications': 0,
            'messages': 0,
            'reviews': 0
        }
        
        # Calculate stats based on user role
        if user.role == 'buyer':
            # For buyers: count their service requests and applications received
            from service_requests.models import ServiceRequest
            from applications.models import Application
            from buyers.models import BuyerProfile
            
            try:
                buyer_profile = BuyerProfile.objects.get(user=user)
                stats['requests'] = ServiceRequest.objects.filter(buyer=buyer_profile).count()
                stats['applications'] = Application.objects.filter(
                    request__buyer=buyer_profile
                ).count()
            except BuyerProfile.DoesNotExist:
                stats['requests'] = 0
                stats['applications'] = 0
            
        elif user.role == 'provider':
            # For providers: count available requests and their applications
            from service_requests.models import ServiceRequest
            from applications.models import Application
            from providers.models import ProviderProfile
            
            stats['requests'] = ServiceRequest.objects.filter(status='open').count()
            
            try:
                provider_profile = ProviderProfile.objects.get(user=user)
                stats['applications'] = Application.objects.filter(provider=provider_profile).count()
            except ProviderProfile.DoesNotExist:
                stats['applications'] = 0
        
        # Count messages (conversations)
        try:
            from chat.models import Conversation
            stats['messages'] = Conversation.objects.filter(
                participants=user
            ).count()
        except:
            stats['messages'] = 0
        
        # Count reviews
        try:
            from reviews.models import Review
            stats['reviews'] = Review.objects.filter(
                Q(reviewer=user) | Q(reviewed_user=user)
            ).count()
        except:
            stats['reviews'] = 0
        
        # Recent activity (simplified for now)
        recent_activity = []
        
        return Response({
            'stats': stats,
            'recent_activity': recent_activity
        })

class TestDashboardView(APIView):
    """Test dashboard without authentication for debugging"""
    permission_classes = []
    
    def get(self, request):
        # Test with hardcoded user imtiaz01
        from users.models import User
        from buyers.models import BuyerProfile
        from service_requests.models import ServiceRequest
        
        try:
            user = User.objects.get(username='imtiaz01')
            buyer_profile = BuyerProfile.objects.get(user=user)
            requests_count = ServiceRequest.objects.filter(buyer=buyer_profile).count()
            
            return Response({
                'username': user.username,
                'role': user.role,
                'buyer_profile_id': buyer_profile.id,
                'service_requests_count': requests_count,
                'test_success': True
            })
        except Exception as e:
            return Response({
                'error': str(e),
                'test_success': False
            })

class TokenRefreshView(BaseTokenRefreshView):
    pass
