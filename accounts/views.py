from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.utils.representation import serializer_repr

from accounts.serializers import RegisterSerializer
from clinic.models import Doctor, Appointment
from clinic.serializers import AppointmentSerializer


@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def logout(request):
    user = request.user
    user.auth_token.delete()
    return Response(status=200)

@api_view(['GET'])
def get_auth_id(request):
    return Response(request.user.id)

@api_view(['GET'])
def doctor_appointment(request):
    if not request.user.is_doctor:
        return Response({"error": "You are not authorized to view this page."}, status=403)

    doctor = Doctor.objects.get(user=request.user)
    appointments = Appointment.objects.filter(slot__doctor=doctor)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)