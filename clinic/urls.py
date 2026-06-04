from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from clinic.views import doctor_list, doctor_create, doctor_update, doctor_delete
from clinic.viewsets import DoctorViewSet, SlotViewSet, AppointmentViewSet

router = DefaultRouter()
router.register(r'doctors_router', DoctorViewSet, basename='doctors')
router.register(r'slots_router', SlotViewSet, basename='slots')
router.register(r'appointments_router', AppointmentViewSet, basename='appointments')

urlpatterns = [
    path('doctors/', doctor_list, name='doctor_list'),
    path('doctors/create/', doctor_create, name='doctor_create'),
    path('doctors/<int:pk>/update/', doctor_update, name='doctor_update'),
    path('doctors/<int:pk>/delete/', doctor_delete, name='doctor_delete'),
    path('auth/', obtain_auth_token),
] + router.urls