# 


import jwt
import datetime
import logging
from django.http import JsonResponse
from rest_framework import status
from functools import wraps

logger = logging.getLogger(__name__)

# Secret key for JWT (in production, store this in environment variables)
JWT_SECRET = ')g(l78bmz=!lr8intfuz%35%50n3dt%=-g91*1=uao0ggu1s@o'
JWT_ALGORITHM = 'HS256'

def generate_jwt_token(user_data):
    """Generate a JWT token for the user."""
    try:
        payload = {
            'user_id': user_data['id'],
            'username': user_data['username'],
            'email': user_data['email'],
            'role': user_data['role'],
            'first_name': user_data.get('first_name', ''),
            'last_name': user_data.get('last_name', ''),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),  # Access token expires in 1 hour
            'iat': datetime.datetime.utcnow(),
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        logger.info(f"JWT token generated for user ID {user_data['id']}")
        return token
    except Exception as e:
        logger.error(f"Error generating JWT token: {str(e)}")
        raise

def generate_refresh_token(user_data):
    """Generate a refresh token for the user."""
    try:
        payload = {
            'user_id': user_data['id'],
            'username': user_data['username'],
            'email': user_data['email'],
            'role': user_data['role'],
            'first_name': user_data.get('first_name', ''),
            'last_name': user_data.get('last_name', ''),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),  # Refresh token expires in 7 days
            'iat': datetime.datetime.utcnow(),
            'type': 'refresh',
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        logger.info(f"Refresh token generated for user ID {user_data['id']}")
        return token
    except Exception as e:
        logger.error(f"Error generating refresh token: {str(e)}")
        raise

def verify_jwt_token(token):
    """Verify a JWT token and return the payload."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        logger.info(f"JWT token verified for user ID {payload.get('user_id')}")
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token expired")
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        logger.warning("Invalid JWT token")
        raise Exception("Invalid token")

def jwt_required(view_func):
    @wraps(view_func)
    def wrapper(self, request, *args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            logger.warning("JWT authentication failed: Missing or invalid Authorization header")
            return JsonResponse({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        token = auth_header.split(' ')[1]
        try:
            payload = verify_jwt_token(token)
            request.user = payload  # Attach the payload to the request for use in views
            return view_func(self, request, *args, **kwargs)
        except Exception as e:
            logger.error(f"JWT authentication failed: {str(e)}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    return wrapper