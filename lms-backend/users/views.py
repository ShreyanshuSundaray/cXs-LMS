# # users/views.py

# import logging
# import mysql.connector
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# import bcrypt  # Updated to use bcrypt
# import json
# from datetime import datetime
# from .auth_utils import generate_jwt_token, generate_refresh_token, jwt_required,verify_jwt_token

# # Set up logging
# logger = logging.getLogger(__name__)

# # Database connection configuration
# DB_CONFIG = {
#     'user': 'root',
#     'password': '100001',
#     'host': '127.0.0.1',
#     'port': '3306',
#     'database': 'lms_db',
# }

# def get_db_connection():
#     """Helper function to get a database connection."""
#     try:
#         conn = mysql.connector.connect(**DB_CONFIG)
#         return conn
#     except mysql.connector.Error as e:
#         logger.error(f"Database connection failed: {str(e)}")
#         raise

# def hash_password(password):
#     """Hash the password using bcrypt."""
#     return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

# class RegisterView(APIView):
#     @csrf_exempt
#     def post(self, request):
#         try:
#             data = json.loads(request.body)
#             username = data.get('username')
#             email = data.get('email')
#             password = data.get('password')
#             first_name = data.get('first_name')
#             last_name = data.get('last_name')
#             role = data.get('role', 'student')

#             if not all([username, email, password, first_name, last_name]):
#                 logger.warning("Registration failed: Missing required fields")
#                 return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

#             # Validate role
#             if role not in ['student', 'instructor']:
#                 logger.warning(f"Registration failed: Invalid role {role}")
#                 return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

#             conn = get_db_connection()
#             cursor = conn.cursor(dictionary=True)

#             # Check if username or email already exists
#             cursor.execute("SELECT id FROM custom_users WHERE username = %s OR email = %s", (username, email))
#             if cursor.fetchone():
#                 cursor.close()
#                 conn.close()
#                 logger.warning(f"Registration failed: Username {username} or email {email} already exists")
#                 return Response({"error": "Username or email already exists"}, status=status.HTTP_400_BAD_REQUEST)

#             # Hash the password with bcrypt
#             hashed_password = hash_password(password)

#             # Insert the new user
#             insert_query = """
#                 INSERT INTO custom_users (username, email, password, first_name, last_name, role, is_active, is_staff, is_superuser, date_joined)
#                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """
#             insert_values = (username, email, hashed_password, first_name, last_name, role, True, False, False, datetime.now())
#             cursor.execute(insert_query, insert_values)
#             conn.commit()

#             user_id = cursor.lastrowid
#             cursor.close()
#             conn.close()

#             logger.info(f"User registered successfully: {username} (ID: {user_id})")
#             return Response({
#                 "id": user_id,
#                 "username": username,
#                 "email": email,
#                 "first_name": first_name,
#                 "last_name": last_name,
#                 "role": role
#             }, status=status.HTTP_201_CREATED)

#         except mysql.connector.Error as e:
#             logger.error(f"Database error during registration: {str(e)}")
#             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             logger.error(f"Unexpected error during registration: {str(e)}")
#             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class LoginView(APIView):
#     @csrf_exempt
#     def post(self, request):
#         try:
#             data = json.loads(request.body)
#             email = data.get('email')
#             password = data.get('password')

#             if not (email and password):
#                 logger.warning("Login failed: Missing email or password")
#                 return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

#             conn = get_db_connection()
#             cursor = conn.cursor(dictionary=True)

#             # Retrieve the user
#             cursor.execute("SELECT * FROM custom_users WHERE email = %s", (email,))
#             user = cursor.fetchone()

#             if not user:
#                 cursor.close()
#                 conn.close()
#                 logger.warning(f"Login failed: User with email {email} not found")
#                 return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

#             # Verify password with bcrypt
#             if not bcrypt.checkpw(password.encode(), user['password'].encode()):
#                 cursor.close()
#                 conn.close()
#                 logger.warning(f"Login failed: Incorrect password for email {email}")
#                 return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

#             # Generate JWT tokens
#             access_token = generate_jwt_token(user)
#             refresh_token = generate_refresh_token(user)

#             cursor.close()
#             conn.close()

#             logger.info(f"User logged in successfully: {user['username']} (ID: {user['id']})")
#             return Response({
#                 "access": access_token,
#                 "refresh": refresh_token
#             }, status=status.HTTP_200_OK)

#         except mysql.connector.Error as e:
#             logger.error(f"Database error during login: {str(e)}")
#             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             logger.error(f"Unexpected error during login: {str(e)}")
#             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class UserProfileView(APIView):
#     @jwt_required
#     def get(self, request):
#         try:
#             user_id = request.user.get('user_id')
#             if not user_id:
#                 logger.warning("Profile retrieval failed: No user_id in token")
#                 return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

#             conn = get_db_connection()
#             cursor = conn.cursor(dictionary=True)

#             cursor.execute("SELECT id, username, email, first_name, last_name, role FROM custom_users WHERE id = %s", (user_id,))
#             user = cursor.fetchone()

#             cursor.close()
#             conn.close()

#             if not user:
#                 logger.warning(f"Profile retrieval failed: User ID {user_id} not found")
#                 return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#             logger.info(f"Profile retrieved successfully for user ID {user_id}")
#             return Response(user, status=status.HTTP_200_OK)

#         except mysql.connector.Error as e:
#             logger.error(f"Database error during profile retrieval: {str(e)}")
#             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             logger.error(f"Unexpected error during profile retrieval: {str(e)}")
#             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

#         # users/views.py (add to the existing file)



# # Existing views (RegisterView, LoginView, UserProfileView) are already here...

# class RefreshTokenView(APIView):
#     @csrf_exempt
#     def post(self, request):
#         try:
#             data = json.loads(request.body)
#             refresh_token = data.get('refresh')

#             if not refresh_token:
#                 logger.warning("Refresh token request failed: Missing refresh token")
#                 return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

#             # Verify the refresh token
#             payload = verify_jwt_token(refresh_token)
#             if payload.get('type') != 'refresh':
#                 logger.warning("Refresh token request failed: Invalid token type")
#                 return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

#             # Reconstruct user data from payload
#             user_data = {
#                 'id': payload['user_id'],
#                 'username': payload['username'],
#                 'email': payload['email'],
#                 'role': payload['role'],
#             }

#             # Generate new access token
#             new_access_token = generate_jwt_token(user_data)

#             logger.info(f"Access token refreshed for user ID {user_data['id']}")
#             return Response({"access": new_access_token}, status=status.HTTP_200_OK)

#         except Exception as e:
#             logger.error(f"Error during token refresh: {str(e)}")
#             return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)




import logging
import mysql.connector
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import bcrypt
import json
from datetime import datetime
from .auth_utils import generate_jwt_token, generate_refresh_token, jwt_required, verify_jwt_token

# Set up logging
logger = logging.getLogger(__name__)

# Database connection configuration
DB_CONFIG = {
    'user': 'root',
    'password': '100001',
    'host': '127.0.0.1',
    'port': '3306',
    'database': 'lms_db',
}

def get_db_connection():
    """Helper function to get a database connection."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as e:
        logger.error(f"Database connection failed: {str(e)}")
        raise

def hash_password(password):
    """Hash the password using bcrypt."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

class RegisterView(APIView):
    @csrf_exempt
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            role = data.get('role', 'student')

            if not all([username, email, password, first_name, last_name]):
                logger.warning("Registration failed: Missing required fields")
                return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

            # Validate role
            if role not in ['student', 'instructor']:
                logger.warning(f"Registration failed: Invalid role {role}")
                return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            # Check if username or email already exists
            cursor.execute("SELECT id FROM custom_users WHERE username = %s OR email = %s", (username, email))
            if cursor.fetchone():
                cursor.close()
                conn.close()
                logger.warning(f"Registration failed: Username {username} or email {email} already exists")
                return Response({"error": "Username or email already exists"}, status=status.HTTP_400_BAD_REQUEST)

            # Hash the password with bcrypt
            hashed_password = hash_password(password)

            # Insert the new user
            insert_query = """
                INSERT INTO custom_users (username, email, password, first_name, last_name, role, is_active, is_staff, is_superuser, date_joined)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            insert_values = (username, email, hashed_password, first_name, last_name, role, True, False, False, datetime.now())
            cursor.execute(insert_query, insert_values)
            conn.commit()

            user_id = cursor.lastrowid
            cursor.close()
            conn.close()

            logger.info(f"User registered successfully: {username} (ID: {user_id})")
            return Response({
                "id": user_id,
                "username": username,
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "role": role
            }, status=status.HTTP_201_CREATED)

        except mysql.connector.Error as e:
            logger.error(f"Database error during registration: {str(e)}")
            return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during registration: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    @csrf_exempt
    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not (email and password):
                logger.warning("Login failed: Missing email or password")
                return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            # Retrieve the user
            cursor.execute("SELECT * FROM custom_users WHERE email = %s", (email,))
            user = cursor.fetchone()

            if not user:
                cursor.close()
                conn.close()
                logger.warning(f"Login failed: User with email {email} not found")
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

            # Verify password with bcrypt
            if not bcrypt.checkpw(password.encode(), user['password'].encode()):
                cursor.close()
                conn.close()
                logger.warning(f"Login failed: Incorrect password for email {email}")
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

            # Prepare user data for token generation
            user_data = {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'role': user['role'],
                'first_name': user['first_name'],
                'last_name': user['last_name']
            }

            # Generate JWT tokens
            access_token = generate_jwt_token(user_data)
            refresh_token = generate_refresh_token(user_data)

            cursor.close()
            conn.close()

            logger.info(f"User logged in successfully: {user['username']} (ID: {user['id']})")
            return Response({
                "accessToken": access_token,  # Renamed to match frontend expectation
                "refreshToken": refresh_token,  # Renamed to match frontend expectation
                "user": {
                    "id": user['id'],
                    "username": user['username'],
                    "email": user['email'],
                    "role": user['role'],
                    "first_name": user['first_name'],
                    "last_name": user['last_name']
                }
            }, status=status.HTTP_200_OK)

        except mysql.connector.Error as e:
            logger.error(f"Database error during login: {str(e)}")
            return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during login: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileView(APIView):
    @jwt_required
    def get(self, request):
        try:
            user_id = request.user.get('user_id')
            if not user_id:
                logger.warning("Profile retrieval failed: No user_id in token")
                return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            cursor.execute("SELECT id, username, email, first_name, last_name, role FROM custom_users WHERE id = %s", (user_id,))
            user = cursor.fetchone()

            cursor.close()
            conn.close()

            if not user:
                logger.warning(f"Profile retrieval failed: User ID {user_id} not found")
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

            logger.info(f"Profile retrieved successfully for user ID {user_id}")
            return Response(user, status=status.HTTP_200_OK)

        except mysql.connector.Error as e:
            logger.error(f"Database error during profile retrieval: {str(e)}")
            return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during profile retrieval: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RefreshTokenView(APIView):
    @csrf_exempt
    def post(self, request):
        try:
            data = json.loads(request.body)
            refresh_token = data.get('refreshToken')  # Match frontend key

            if not refresh_token:
                logger.warning("Refresh token request failed: Missing refresh token")
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Verify the refresh token
            payload = verify_jwt_token(refresh_token)
            if payload.get('type') != 'refresh':
                logger.warning("Refresh token request failed: Invalid token type")
                return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

            # Reconstruct user data from payload
            user_data = {
                'id': payload['user_id'],
                'username': payload['username'],
                'email': payload['email'],
                'role': payload['role'],
                'first_name': payload.get('first_name', ''),
                'last_name': payload.get('last_name', '')
            }

            # Generate new access token
            new_access_token = generate_jwt_token(user_data)

            logger.info(f"Access token refreshed for user ID {user_data['id']}")
            return Response({"accessToken": new_access_token}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error during token refresh: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        




from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
import json

# Store in session for now (no models)
@csrf_exempt
@login_required
def enroll_course(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        course_id = data.get('course_id')
        request.session.setdefault('enrolled_courses', []).append(course_id)
        request.session.modified = True
        return JsonResponse({'message': 'Enrolled successfully'})

@csrf_exempt
@login_required
def purchase_course(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        course_id = data.get('course_id')
        code = data.get('purchase_code')
        if code and code.isdigit() and len(code) == 5:
            request.session.setdefault('purchased_courses', []).append(course_id)
            request.session.modified = True
            return JsonResponse({'message': 'Purchase successful'})
        return JsonResponse({'error': 'Invalid code'}, status=400)

@csrf_exempt
@login_required
def update_progress(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        course_id = data.get('course_id')
        progress = data.get('progress')  # e.g. 0-100
        if not isinstance(progress, int):
            return JsonResponse({'error': 'Invalid progress'}, status=400)
        progress_data = request.session.get('progress_data', {})
        progress_data[course_id] = progress
        request.session['progress_data'] = progress_data
        request.session.modified = True
        return JsonResponse({'message': 'Progress updated'})

@login_required
def get_progress(request, course_id):
    progress = request.session.get('progress_data', {}).get(course_id, 0)
    return JsonResponse({'progress': progress})
