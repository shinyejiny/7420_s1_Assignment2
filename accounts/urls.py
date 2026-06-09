from django.urls import path
from accounts.views import register, logout, get_auth_id

urlpatterns = [
    path('register/', register, name='register'),
    path('auth/logout/', logout, name='logout'),
    path('auth/get_auth_id/', get_auth_id, name='get_auth_id'),
]   