from django.contrib import admin
from .models import Patient, Doctor, PatientDoctorMapping


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'email', 'phone', 'gender', 'user', 'created_at']
    list_filter = ['gender', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    date_hierarchy = 'created_at'


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'specialization', 'license_number', 'available', 'user', 'created_at']
    list_filter = ['specialization', 'available', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'license_number']
    date_hierarchy = 'created_at'


@admin.register(PatientDoctorMapping)
class PatientDoctorMappingAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'doctor', 'assigned_date', 'is_active', 'created_at']
    list_filter = ['is_active', 'assigned_date']
    search_fields = ['patient__first_name', 'patient__last_name', 'doctor__first_name', 'doctor__last_name']
    date_hierarchy = 'assigned_date'