from django.http import Http404
from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions
from .models import Doctor, Slot, Appointment
from .serializers import DoctorSerializer, SlotSerializer, AppointmentSerializer
from accounts.serializers import RegisterSerializer

User = get_user_model()

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class SlotViewSet(viewsets.ModelViewSet):
    queryset = Slot.objects.all()
    serializer_class = SlotSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_anonymous:
            raise Http404("Login first.")
        if self.request.user.is_admin:
            return Appointment.objects.all()
        return Appointment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.is_anonymous:
            raise Http404("Login first.")
        serializer.save(user=self.request.user)
        appointment.slot.is_booked = True
        appointment.slot.save()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer