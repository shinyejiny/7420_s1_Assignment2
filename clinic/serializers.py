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
    def validate(self, data):
        doctor = data.get('doctor')
        date = data.get('date')
        time = data.get('time')
        if Slot.objects.filter(doctor=doctor, date=date, time=time).exists():
            raise serializers.ValidationError("This slot already exists for this doctor.")
        return data


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['user']

    def validate_slot(self, value):
        if value.is_booked:
            raise serializers.ValidationError("This slot is already booked.")

        user = self.context['request'].user
        same_time = Appointment.objects.filter(
            user=user,
            slot__date=value.date,
            slot__time=value.time
        ).exists()
        if same_time:
            raise serializers.ValidationError("You already have an appointment at this time")

        same_doctor_day = Appointment.objects.filter(
            user=user,
            slot__doctor=value.doctor,
            slot__date=value.date
        ).exists()
        if same_doctor_day:
            raise serializers.ValidationError("You already have an appointment with this doctor")
        return value
