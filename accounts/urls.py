from django.urls import path
from rest_framework.routers import DefaultRouter
from accounts.views import register, logout, get_auth_id
from accounts.viewsets import UserViewSet
router = DefaultRouter()
router.register(r'users_router', UserViewSet, basename='users')

urlpatterns = [
    path('register/', register, name='register'),
    path('auth/logout/', logout, name='logout'),
    path('auth/get_auth_id/', get_auth_id, name='get_auth_id'),
] + router.urls