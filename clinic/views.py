from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from clinic.models import Doctor, Slot, Appointment
from clinic.serializers import DoctorSerializer, SlotSerializer, AppointmentSerializer
from accounts.serializers import RegisterSerializer

@api_view(['GET'])
def doctor_list(request):
    doctors = Doctor.objects.all()
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def doctor_create(request):
    serializer = DoctorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
def doctor_update(request, pk):
    doctor = get_object_or_404(Doctor, pk=pk)
    serializer = DoctorSerializer(doctor, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
def doctor_delete(request, pk):
    doctor = get_object_or_404(Doctor, pk=pk)
    doctor.delete()
    return Response(status=204)

@api_view(['GET'])
def doctor_appointments(request):
    if not request.user.is_doctor:
        return Response({'error': 'Not a doctor'}, status=403)
    doctor = Doctor.objects.get(user=request.user)
    appointments = Appointment.objects.filter(slot__doctor=doctor)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def doctor_slots(request):
    if not request.user.is_doctor:
        return Response({'error': 'Not a doctor'}, status=403)
    doctor = Doctor.objects.get(user=request.user)
    slots = Slot.objects.filter(doctor=doctor)
    serializer = SlotSerializer(slots, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def doctor_add_slot(request):
    if not request.user.is_doctor:
        return Response({'error': 'Not a doctor'}, status=403)
    doctor = Doctor.objects.get(user=request.user)
    data = request.data.copy()
    data['doctor'] = doctor.id
    serializer = SlotSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['PATCH'])
def doctor_update_appointment(request, pk):
    if not request.user.is_doctor:
        return Response({'error': 'Not a doctor'}, status=403)
    appointment = get_object_or_404(Appointment, pk=pk)
    status_value = request.data.get('status')
    appointment.status = status_value
    appointment.save()
    serializer = AppointmentSerializer(appointment)
    return Response(serializer.data)