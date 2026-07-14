from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    doctor_name = serializers.SerializerMethodField()


    class Meta:
        model = CustomUser
        fields = ['id','username', 'email', 'password', 'is_patient', 'is_admin', 'is_doctor', 'doctor_name']
        read_only_fields = ['id']

    def get_doctor_name(self, obj):
        if obj.is_doctor:
            try:
                return obj.doctor.name  # Doctor 모델의 name
            except:
                return obj.username
        return obj.username

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user