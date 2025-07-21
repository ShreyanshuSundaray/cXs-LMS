# lms/middleware.py
from django.http import HttpResponseRedirect
from django.urls import reverse

class AuthRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Allow OPTIONS requests for CORS preflight
        if request.method == "OPTIONS":
            return self.get_response(request)

        # Check if the request is for an API endpoint
        if request.path.startswith('/api/'):
            # Allow internal requests from localhost:3000
            if request.META.get('HTTP_ORIGIN') == 'http://localhost:3000':
                return self.get_response(request)
            # Redirect external API requests to home
            return HttpResponseRedirect(reverse('home'))

        # Redirect authenticated users from login page
        if request.path == '/login/' and request.user.is_authenticated:
            return HttpResponseRedirect(reverse('home'))

        response = self.get_response(request)
        return response