from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('token/refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
]
