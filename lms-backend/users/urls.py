# users/urls.py
from django.urls import path
from .views import RegisterView, LoginView, UserProfileView,RefreshTokenView,enroll_course,purchase_course,update_progress,get_progress

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh'),
    path('enroll_course/', enroll_course, name='enroll_course'),
    path('purchase_course/', purchase_course, name='purchase_course'),
    path('update_progress/', update_progress, name='update_progress'),
    path('get_progress/',get_progress, name='get_progress'),
]