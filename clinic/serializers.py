from rest_framework import serializers
from .models import Doctor, Slot, Appointment

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['user']

    def validate_slot(self, value):
        if value.is_booked:
            raise serializers.ValidationError("This slot is already booked.")
        return value
