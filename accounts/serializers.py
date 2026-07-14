from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id','username', 'email', 'password', 'is_patient', 'is_admin', 'is_doctor']
        read_only_fields = ['id']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user