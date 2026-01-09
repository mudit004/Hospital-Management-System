from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    register_user, login_user,
    PatientViewSet, DoctorViewSet, PatientDoctorMappingViewSet
)

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'doctors', DoctorViewSet, basename='doctor')
router.register(r'mappings', PatientDoctorMappingViewSet, basename='mapping')

urlpatterns = [
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('', include(router.urls)),
]