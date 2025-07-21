from django.urls import include, path
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

logger.info("Loading URL patterns for lms project")

def home(request):
    if request.user.is_authenticated:
        return JsonResponse({"message": "You are already logged in. Welcome to the LMS!"}, status=200)
    return JsonResponse({"message": "Welcome to the LMS API"}, status=200)

urlpatterns = [
    path('', home, name='home'),
    path('api/users/', include('users.urls')),
    path('api/courses/', include('courses.urls')),
]

logger.info("URL patterns loaded in lms/urls.py: %s", [str(pattern) for pattern in urlpatterns])