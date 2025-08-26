from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_view(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_view),
    path('api/auth/', include('users.urls')),
    path('api/', include('users.urls')),  # For dashboard endpoint
    path('api/buyers/', include('buyers.urls')),
    path('api/providers/', include('providers.urls')),
    path('api/service-requests/', include('service_requests.urls')),
    path('api/applications/', include('applications.urls')),
    path('api/documents/', include('documents.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/notifications/', include('notifications.urls')),
]
