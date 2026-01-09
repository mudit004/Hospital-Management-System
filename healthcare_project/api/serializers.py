from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Patient, Doctor, PatientDoctorMapping


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    name = serializers.CharField(required=True)
    
    class Meta:
        model = User
        fields = ('name', 'email', 'password', 'password2')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists."})
        
        return attrs
    
    def create(self, validated_data):
        name = validated_data['name']
        first_name = name.split()[0] if name else ''
        last_name = ' '.join(name.split()[1:]) if len(name.split()) > 1 else ''
        
        user = User.objects.create(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=first_name,
            last_name=last_name
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class PatientSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Patient
        fields = [
            'id', 'first_name', 'last_name', 'date_of_birth', 'gender',
            'phone', 'email', 'address', 'medical_history', 'user_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_phone(self, value):
        if not value.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise serializers.ValidationError("Phone number must contain only digits, spaces, hyphens, or plus sign.")
        return value


class DoctorSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Doctor
        fields = [
            'id', 'first_name', 'last_name', 'specialization', 'license_number',
            'phone', 'email', 'years_of_experience', 'consultation_fee',
            'available', 'user_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_years_of_experience(self, value):
        if value < 0:
            raise serializers.ValidationError("Years of experience cannot be negative.")
        return value
    
    def validate_consultation_fee(self, value):
        if value < 0:
            raise serializers.ValidationError("Consultation fee cannot be negative.")
        return value


class PatientDoctorMappingSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.__str__', read_only=True)
    doctor_name = serializers.CharField(source='doctor.__str__', read_only=True)
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_details = DoctorSerializer(source='doctor', read_only=True)
    
    class Meta:
        model = PatientDoctorMapping
        fields = [
            'id', 'patient', 'doctor', 'patient_name', 'doctor_name',
            'patient_details', 'doctor_details', 'assigned_date',
            'notes', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'assigned_date', 'created_at', 'updated_at']
    
    def validate(self, attrs):
        patient = attrs.get('patient')
        doctor = attrs.get('doctor')
        
        if self.instance is None:
            if PatientDoctorMapping.objects.filter(patient=patient, doctor=doctor, is_active=True).exists():
                raise serializers.ValidationError("This patient is already assigned to this doctor.")
        
        return attrs