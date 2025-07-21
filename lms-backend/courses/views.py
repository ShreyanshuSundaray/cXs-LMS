# import logging
# import mysql.connector
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# import json
# from datetime import datetime
# from users.auth_utils import jwt_required

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

# class CourseCreateView(APIView):
#     @csrf_exempt
#     @jwt_required
#     def post(self, request):
#         try:
#             user_id = request.user.get('user_id')
#             role = request.user.get('role')

#             if role != 'instructor':
#                 logger.warning(f"Course creation failed: User ID {user_id} is not an instructor")
#                 return Response({"error": "Only instructors can create courses"}, status=status.HTTP_403_FORBIDDEN)

#             data = json.loads(request.body)
#             title = data.get('title')
#             description = data.get('description')
#             price = data.get('price', 0.00)

#             if not all([title, description]):
#                 logger.warning("Course creation failed: Missing required fields")
#                 return Response({"error": "Title and description are required"}, status=status.HTTP_400_BAD_REQUEST)

#             conn = get_db_connection()
#             cursor = conn.cursor(dictionary=True)

#             # Insert the new course
#             insert_query = """
#                 INSERT INTO courses (title, description, price, instructor_id, created_at, updated_at)
#                 VALUES (%s, %s, %s, %s, %s, %s)
#             """
#             insert_values = (title, description, float(price), user_id, datetime.now(), datetime.now())
#             cursor.execute(insert_query, insert_values)
#             conn.commit()

#             course_id = cursor.lastrowid
#             cursor.close()
#             conn.close()

#             logger.info(f"Course created successfully: {title} (ID: {course_id}) by instructor ID {user_id}")
#             return Response({
#                 "id": course_id,
#                 "title": title,
#                 "description": description,
#                 "price": float(price),
#                 "instructor_id": user_id
#             }, status=status.HTTP_201_CREATED)

#         except mysql.connector.Error as e:
#             logger.error(f"Database error during course creation: {str(e)}")
#             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             logger.error(f"Unexpected error during course creation: {str(e)}")
#             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class CourseListView(APIView):
#     def get(self, request):
#         try:
#             conn = get_db_connection()
#             cursor = conn.cursor(dictionary=True)

#             # Retrieve all courses with instructor details
#             query = """
#                 SELECT c.id, c.title, c.description, c.price, c.instructor_id, 
#                        u.username as instructor_name
#                 FROM courses c
#                 JOIN custom_users u ON c.instructor_id = u.id
#             """
#             cursor.execute(query)
#             courses = cursor.fetchall()

#             # Add average rating for each course
#             for course in courses:
#                 cursor.execute("""
#                     SELECT AVG(rating) as avg_rating, COUNT(rating) as rating_count
#                     FROM ratings
#                     WHERE course_id = %s
#                 """, (course['id'],))
#                 rating_data = cursor.fetchone()
#                 course['avg_rating'] = round(float(rating_data['avg_rating']), 1) if rating_data['avg_rating'] else 0
#                 course['rating_count'] = rating_data['rating_count'] or 0

#             cursor.close()
#             conn.close()

#             logger.info("Courses retrieved successfully")
#             return Response(courses, status=status.HTTP_200_OK)

#         except mysql.connector.Error as e:
#             logger.error(f"Database error during course retrieval: {str(e)}")
#             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             logger.error(f"Unexpected error during course retrieval: {str(e)}")
#             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class CourseDetailView(APIView):
#     def get(self, request, pk):
#         try:
#             conn = get_db_connection()
#             cursor = conn.cursor(dictionary=True)

#             # Retrieve a specific course with instructor details
#             query = """
#                 SELECT c.id, c.title, c.description, c.price, c.instructor_id, 
#                        u.username as instructor_name
#                 FROM courses c
#                 JOIN custom_users u ON c.instructor_id = u.id
#                 WHERE c.id = %s
#             """
#             cursor.execute(query, (pk,))
#             course = cursor.fetchone()

#             if not course:
#                 logger.warning(f"Course retrieval failed: Course ID {pk} not found")
#                 return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

#             # Add average rating and rating count
#             cursor.execute("""
#                 SELECT AVG(rating) as avg_rating, COUNT(rating) as rating_count
#                 FROM ratings
#                 WHERE course_id = %s
#             """, (pk,))
#             rating_data = cursor.fetchone()
#             course['avg_rating'] = round(float(rating_data['avg_rating']), 1) if rating_data['avg_rating'] else 0
#             course['rating_count'] = rating_data['rating_count'] or 0

#             cursor.close()
#             conn.close()

#             logger.info(f"Course retrieved successfully: ID {pk}")
#             return Response(course, status=status.HTTP_200_OK)

#         except mysql.connector.Error as e:
#             logger.error(f"Database error during course detail retrieval: {str(e)}")
#             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             logger.error(f"Unexpected error during course detail retrieval: {str(e)}")
#             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # New view to handle course enrollment
# class EnrollView(APIView):
#     @jwt_required
#     def post(self, request, course_id):
#         try:
#             user_id = request.user.get('user_id')
#             role = request.user.get('role')

#             if role != 'student':
#                 logger.warning(f"Unauthorized enrollment attempt by user ID {user_id}")
#                 return Response({"error": "Only students can enroll in courses"}, status=status.HTTP_403_FORBIDDEN)

#             conn = get_db_connection()
#             cursor = conn.cursor(dictionary=True)

#             # Check if the course exists
#             cursor.execute("SELECT id FROM courses WHERE id = %s", (course_id,))
#             if not cursor.fetchone():
#                 cursor.close()
#                 conn.close()
#                 logger.warning(f"Course not found for enrollment: ID {course_id}")
#                 return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

#             # Check if the user is already enrolled
#             cursor.execute(
#                 "SELECT id FROM enrollments WHERE user_id = %s AND course_id = %s",
#                 (user_id, course_id)
#             )
#             if cursor.fetchone():
#                 cursor.close()
#                 conn.close()
#                 logger.warning(f"User ID {user_id} already enrolled in Course ID {course_id}")
#                 return Response({"error": "You are already enrolled in this course"}, status=status.HTTP_400_BAD_REQUEST)

#             # Enroll the user
#             cursor.execute(
#                 """
#                 INSERT INTO enrollments (user_id, course_id, enrollment_date)
#                 VALUES (%s, %s, %s)
#                 """,
#                 (user_id, course_id, datetime.now())
#             )
#             conn.commit()

#             cursor.close()
#             conn.close()

#             logger.info(f"User ID {user_id} enrolled in Course ID {course_id}")
#             return Response({"message": "Successfully enrolled in the course"}, status=status.HTTP_200_OK)

#         except mysql.connector.Error as e:
#             logger.error(f"Database error during enrollment: {str(e)}")
#             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             logger.error(f"Unexpected error during enrollment: {str(e)}")
#             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # New view to get enrolled courses
# class EnrolledCoursesView(APIView):
#     @jwt_required
#     def get(self, request):
#         try:
#             user_id = request.user.get('user_id')

#             conn = get_db_connection()
#             cursor = conn.cursor(dictionary=True)

#             query = """
#                 SELECT c.id, c.title, c.description, c.price, c.instructor_id, 
#                        u.username as instructor_name
#                 FROM courses c
#                 JOIN enrollments e ON c.id = e.course_id
#                 JOIN custom_users u ON c.instructor_id = u.id
#                 WHERE e.user_id = %s
#             """
#             cursor.execute(query, (user_id,))
#             courses = cursor.fetchall()

#             cursor.close()
#             conn.close()

#             logger.info(f"Enrolled courses retrieved for user ID {user_id}")
#             return Response(courses, status=status.HTTP_200_OK)

#         except mysql.connector.Error as e:
#             logger.error(f"Database error during enrolled courses retrieval: {str(e)}")
#             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             logger.error(f"Unexpected error during enrolled courses retrieval: {str(e)}")
#             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # New view to handle rating submissions
# class RateCourseView(APIView):
#     @jwt_required
#     def post(self, request, course_id):
#         try:
#             user_id = request.user.get('user_id')
#             role = request.user.get('role')

#             if role != 'student':
#                 logger.warning(f"Unauthorized rating attempt by user ID {user_id}")
#                 return Response({"error": "Only students can rate courses"}, status=status.HTTP_403_FORBIDDEN)

#             data = json.loads(request.body)
#             rating = data.get('rating')
#             review = data.get('review', '')

#             if not rating or not isinstance(rating, (int, float)) or rating < 1 or rating > 5:
#                 logger.warning(f"Invalid rating value: {rating}")
#                 return Response({"error": "Rating must be between 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)

#             conn = get_db_connection()
#             cursor = conn.cursor(dictionary=True)

#             # Check if the course exists
#             cursor.execute("SELECT id FROM courses WHERE id = %s", (course_id,))
#             if not cursor.fetchone():
#                 cursor.close()
#                 conn.close()
#                 logger.warning(f"Course not found for rating: ID {course_id}")
#                 return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

#             # Check if the user is enrolled
#             cursor.execute(
#                 "SELECT id FROM enrollments WHERE user_id = %s AND course_id = %s",
#                 (user_id, course_id)
#             )
#             if not cursor.fetchone():
#                 cursor.close()
#                 conn.close()
#                 logger.warning(f"User ID {user_id} not enrolled in Course ID {course_id}")
#                 return Response({"error": "You must be enrolled to rate this course"}, status=status.HTTP_400_BAD_REQUEST)

#             # Check if the user already rated this course
#             cursor.execute(
#                 "SELECT id FROM ratings WHERE user_id = %s AND course_id = %s",
#                 (user_id, course_id)
#             )
#             if cursor.fetchone():
#                 cursor.close()
#                 conn.close()
#                 logger.warning(f"User ID {user_id} already rated Course ID {course_id}")
#                 return Response({"error": "You have already rated this course"}, status=status.HTTP_400_BAD_REQUEST)

#             # Add the rating
#             cursor.execute(
#                 """
#                 INSERT INTO ratings (user_id, course_id, rating, review, rated_at)
#                 VALUES (%s, %s, %s, %s, %s)
#                 """,
#                 (user_id, course_id, int(rating), review, datetime.now())
#             )
#             conn.commit()

#             cursor.close()
#             conn.close()

#             logger.info(f"User ID {user_id} rated Course ID {course_id}")
#             return Response({"message": "Rating submitted successfully"}, status=status.HTTP_200_OK)

#         except mysql.connector.Error as e:
#             logger.error(f"Database error during rating submission: {str(e)}")
#             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             logger.error(f"Unexpected error during rating submission: {str(e)}")
#             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # New view to get course ratings
# class CourseRatingsView(APIView):
#     def get(self, request, course_id):
#         try:
#             conn = get_db_connection()
#             cursor = conn.cursor(dictionary=True)

#             # Check if the course exists
#             cursor.execute("SELECT id FROM courses WHERE id = %s", (course_id,))
#             if not cursor.fetchone():
#                 cursor.close()
#                 conn.close()
#                 logger.warning(f"Course not found for ratings: ID {course_id}")
#                 return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

#             # Retrieve ratings for the course
#             query = """
#                 SELECT r.id, r.user_id, r.course_id, r.rating, r.review, r.rated_at, 
#                        u.username
#                 FROM ratings r
#                 JOIN custom_users u ON r.user_id = u.id
#                 WHERE r.course_id = %s
#                 ORDER BY r.rated_at DESC
#             """
#             cursor.execute(query, (course_id,))
#             ratings = cursor.fetchall()

#             cursor.close()
#             conn.close()

#             logger.info(f"Ratings retrieved for Course ID {course_id}")
#             return Response(ratings, status=status.HTTP_200_OK)

#         except mysql.connector.Error as e:
#             logger.error(f"Database error during ratings retrieval: {str(e)}")
#             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             logger.error(f"Unexpected error during ratings retrieval: {str(e)}")
#             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # New view for user dashboard
# class UserDashboardView(APIView):
#     @jwt_required
#     def get(self, request):
#         try:
#             user_id = request.user.get('user_id')

#             conn = get_db_connection()
#             cursor = conn.cursor(dictionary=True)

#             # Retrieve user profile
#             cursor.execute(
#                 """
#                 SELECT id, username, email, first_name, last_name, role
#                 FROM custom_users
#                 WHERE id = %s
#                 """,
#                 (user_id,)
#             )
#             user = cursor.fetchone()

#             if not user:
#                 cursor.close()
#                 conn.close()
#                 logger.warning(f"User not found: ID {user_id}")
#                 return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#             # Retrieve enrolled courses
#             cursor.execute(
#                 """
#                 SELECT c.id, c.title, c.description, c.price, c.instructor_id, 
#                        u.username as instructor_name
#                 FROM courses c
#                 JOIN enrollments e ON c.id = e.course_id
#                 JOIN custom_users u ON c.instructor_id = u.id
#                 WHERE e.user_id = %s
#                 """,
#                 (user_id,)
#             )
#             enrolled_courses = cursor.fetchall()

#             cursor.close()
#             conn.close()

#             response_data = {
#                 "user": {
#                     "id": user['id'],
#                     "username": user['username'],
#                     "email": user['email'],
#                     "first_name": user['first_name'],
#                     "last_name": user['last_name'],
#                     "role": user['role']
#                 },
#                 "enrolled_courses": enrolled_courses
#             }

#             logger.info(f"Dashboard data retrieved for user ID {user_id}")
#             return Response(response_data, status=status.HTTP_200_OK)

#         except mysql.connector.Error as e:
#             logger.error(f"Database error during dashboard retrieval: {str(e)}")
#             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         except Exception as e:
#             logger.error(f"Unexpected error during dashboard retrieval: {str(e)}")
#             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)







# # # courses/views.py


# # import logging
# # import mysql.connector
# # from django.http import JsonResponse
# # from django.views.decorators.csrf import csrf_exempt
# # from rest_framework.views import APIView
# # from rest_framework.response import Response
# # from rest_framework import status
# # import json
# # from datetime import datetime
# # from users.auth_utils import jwt_required

# # # Set up logging
# # logger = logging.getLogger(__name__)

# # # Database connection configuration
# # DB_CONFIG = {
# #     'user': 'root',
# #     'password': '100001',
# #     'host': '127.0.0.1',
# #     'port': '3306',
# #     'database': 'lms_db',
# # }

# # def get_db_connection():
# #     """Helper function to get a database connection."""
# #     try:
# #         conn = mysql.connector.connect(**DB_CONFIG)
# #         return conn
# #     except mysql.connector.Error as e:
# #         logger.error(f"Database connection failed: {str(e)}")
# #         raise

# # class CourseCreateView(APIView):
# #     @csrf_exempt
# #     @jwt_required
# #     def post(self, request):
# #         try:
# #             user_id = request.user.get('user_id')
# #             role = request.user.get('role')

# #             if role != 'instructor':
# #                 logger.warning(f"Course creation failed: User ID {user_id} is not an instructor")
# #                 return Response({"error": "Only instructors can create courses"}, status=status.HTTP_403_FORBIDDEN)

# #             data = json.loads(request.body)
# #             title = data.get('title')
# #             description = data.get('description')
# #             price = data.get('price', 0.00)

# #             if not all([title, description]):
# #                 logger.warning("Course creation failed: Missing required fields")
# #                 return Response({"error": "Title and description are required"}, status=status.HTTP_400_BAD_REQUEST)

# #             conn = get_db_connection()
# #             cursor = conn.cursor(dictionary=True)

# #             # Insert the new course
# #             insert_query = """
# #                 INSERT INTO courses (title, description, price, instructor_id, created_at, updated_at)
# #                 VALUES (%s, %s, %s, %s, %s, %s)
# #             """
# #             insert_values = (title, description, float(price), user_id, datetime.now(), datetime.now())
# #             cursor.execute(insert_query, insert_values)
# #             conn.commit()

# #             course_id = cursor.lastrowid
# #             cursor.close()
# #             conn.close()

# #             logger.info(f"Course created successfully: {title} (ID: {course_id}) by instructor ID {user_id}")
# #             return Response({
# #                 "id": course_id,
# #                 "title": title,
# #                 "description": description,
# #                 "price": float(price),
# #                 "instructor_id": user_id
# #             }, status=status.HTTP_201_CREATED)

# #         except mysql.connector.Error as e:
# #             logger.error(f"Database error during course creation: {str(e)}")
# #             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# #         except Exception as e:
# #             logger.error(f"Unexpected error during course creation: {str(e)}")
# #             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # class CourseListView(APIView):
# #     def get(self, request):
# #         try:
# #             conn = get_db_connection()
# #             cursor = conn.cursor(dictionary=True)

# #             # Retrieve all courses with instructor details
# #             query = """
# #                 SELECT c.id, c.title, c.description, c.price, c.instructor_id, 
# #                        u.username as instructor_name
# #                 FROM courses c
# #                 JOIN custom_users u ON c.instructor_id = u.id
# #             """
# #             cursor.execute(query)
# #             courses = cursor.fetchall()

# #             cursor.close()
# #             conn.close()

# #             logger.info("Courses retrieved successfully")
# #             return Response(courses, status=status.HTTP_200_OK)

# #         except mysql.connector.Error as e:
# #             logger.error(f"Database error during course retrieval: {str(e)}")
# #             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# #         except Exception as e:
# #             logger.error(f"Unexpected error during course retrieval: {str(e)}")
# #             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # class CourseDetailView(APIView):
# #     def get(self, request, pk):
# #         try:
# #             conn = get_db_connection()
# #             cursor = conn.cursor(dictionary=True)

# #             # Retrieve a specific course with instructor details
# #             query = """
# #                 SELECT c.id, c.title, c.description, c.price, c.instructor_id, 
# #                        u.username as instructor_name
# #                 FROM courses c
# #                 JOIN custom_users u ON c.instructor_id = u.id
# #                 WHERE c.id = %s
# #             """
# #             cursor.execute(query, (pk,))
# #             course = cursor.fetchone()

# #             cursor.close()
# #             conn.close()

# #             if not course:
# #                 logger.warning(f"Course retrieval failed: Course ID {pk} not found")
# #                 return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

# #             logger.info(f"Course retrieved successfully: ID {pk}")
# #             return Response(course, status=status.HTTP_200_OK)

# #         except mysql.connector.Error as e:
# #             logger.error(f"Database error during course detail retrieval: {str(e)}")
# #             return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# #         except Exception as e:
# #             logger.error(f"Unexpected error during course detail retrieval: {str(e)}")
# #             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



import logging
import mysql.connector
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
from datetime import datetime
from users.auth_utils import jwt_required

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

class CourseCreateView(APIView):
    @csrf_exempt
    @jwt_required
    def post(self, request):
        try:
            user_id = request.user.get('user_id')
            role = request.user.get('role')

            if role != 'instructor':
                logger.warning(f"Course creation failed: User ID {user_id} is not an instructor")
                return Response({"error": "Only instructors can create courses"}, status=status.HTTP_403_FORBIDDEN)

            data = json.loads(request.body)
            title = data.get('title')
            description = data.get('description')
            price = data.get('price', 0.00)
            category = data.get('category', 'Uncategorized')

            if not all([title, description]):
                logger.warning("Course creation failed: Missing required fields")
                return Response({"error": "Title and description are required"}, status=status.HTTP_400_BAD_REQUEST)

            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            # Insert the new course
            insert_query = """
                INSERT INTO courses (title, description, price, instructor_id, category, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            insert_values = (title, description, float(price), user_id, category, datetime.now(), datetime.now())
            cursor.execute(insert_query, insert_values)
            conn.commit()

            course_id = cursor.lastrowid
            cursor.close()
            conn.close()

            logger.info(f"Course created successfully: {title} (ID: {course_id}) by instructor ID {user_id}")
            return Response({
                "id": course_id,
                "title": title,
                "description": description,
                "price": float(price),
                "instructor_id": user_id,
                "category": category
            }, status=status.HTTP_201_CREATED)

        except mysql.connector.Error as e:
            logger.error(f"Database error during course creation: {str(e)}")
            return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during course creation: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class CourseListView(APIView):
    def get(self, request):
        try:
            search_query = request.GET.get('search', '')
            category = request.GET.get('category', '')

            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            # Build the query with search and category filters
            query = """
                SELECT c.id, c.title, c.description, c.price, c.instructor_id, 
                       c.category, u.username as instructor_name
                FROM courses c
                JOIN custom_users u ON c.instructor_id = u.id
                WHERE 1=1
            """
            params = []

            if search_query:
                query += " AND (c.title LIKE %s OR c.description LIKE %s)"
                search_pattern = f"%{search_query}%"
                params.extend([search_pattern, search_pattern])

            if category:
                query += " AND c.category = %s"
                params.append(category)

            cursor.execute(query, params)
            courses = cursor.fetchall()

            # Add average rating for each course
            for course in courses:
                cursor.execute("""
                    SELECT AVG(rating) as avg_rating, COUNT(rating) as rating_count
                    FROM ratings
                    WHERE course_id = %s
                """, (course['id'],))
                rating_data = cursor.fetchone()
                course['avg_rating'] = round(float(rating_data['avg_rating']), 1) if rating_data['avg_rating'] else 0
                course['rating_count'] = rating_data['rating_count'] or 0

            # Get available categories
            cursor.execute("SELECT DISTINCT category FROM courses")
            categories = [row['category'] for row in cursor.fetchall()]

            cursor.close()
            conn.close()

            logger.info("Courses retrieved successfully")
            return Response({
                "courses": courses,
                "categories": categories
            }, status=status.HTTP_200_OK)

        except mysql.connector.Error as e:
            logger.error(f"Database error during course retrieval: {str(e)}")
            return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during course retrieval: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class CourseDetailView(APIView):
    def get(self, request, pk):
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            # Retrieve a specific course with instructor details
            query = """
                SELECT c.id, c.title, c.description, c.price, c.instructor_id, 
                       c.category, u.username as instructor_name
                FROM courses c
                JOIN custom_users u ON c.instructor_id = u.id
                WHERE c.id = %s
            """
            cursor.execute(query, (pk,))
            course = cursor.fetchone()

            if not course:
                logger.warning(f"Course retrieval failed: Course ID {pk} not found")
                return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

            # Add average rating and rating count
            cursor.execute("""
                SELECT AVG(rating) as avg_rating, COUNT(rating) as rating_count
                FROM ratings
                WHERE course_id = %s
            """, (pk,))
            rating_data = cursor.fetchone()
            course['avg_rating'] = round(float(rating_data['avg_rating']), 1) if rating_data['avg_rating'] else 0
            course['rating_count'] = rating_data['rating_count'] or 0

            cursor.close()
            conn.close()

            logger.info(f"Course retrieved successfully: ID {pk}")
            return Response(course, status=status.HTTP_200_OK)

        except mysql.connector.Error as e:
            logger.error(f"Database error during course detail retrieval: {str(e)}")
            return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during course detail retrieval: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EnrollView(APIView):
    @jwt_required
    def post(self, request, course_id):
        try:
            user_id = request.user.get('user_id')
            role = request.user.get('role')

            if role != 'student':
                logger.warning(f"Unauthorized enrollment attempt by user ID {user_id}")
                return Response({"error": "Only students can enroll in courses"}, status=status.HTTP_403_FORBIDDEN)

            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            # Check if the course exists
            cursor.execute("SELECT id FROM courses WHERE id = %s", (course_id,))
            if not cursor.fetchone():
                cursor.close()
                conn.close()
                logger.warning(f"Course not found for enrollment: ID {course_id}")
                return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

            # Check if the user is already enrolled
            cursor.execute(
                "SELECT id FROM enrollments WHERE user_id = %s AND course_id = %s",
                (user_id, course_id)
            )
            if cursor.fetchone():
                cursor.close()
                conn.close()
                logger.warning(f"User ID {user_id} already enrolled in Course ID {course_id}")
                return Response({"error": "You are already enrolled in this course"}, status=status.HTTP_400_BAD_REQUEST)

            # Enroll the user
            cursor.execute(
                """
                INSERT INTO enrollments (user_id, course_id, enrollment_date)
                VALUES (%s, %s, %s)
                """,
                (user_id, course_id, datetime.now())
            )
            conn.commit()

            cursor.close()
            conn.close()

            logger.info(f"User ID {user_id} enrolled in Course ID {course_id}")
            return Response({"message": "Successfully enrolled in the course"}, status=status.HTTP_200_OK)

        except mysql.connector.Error as e:
            logger.error(f"Database error during enrollment: {str(e)}")
            return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during enrollment: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EnrolledCoursesView(APIView):
    @jwt_required
    def get(self, request):
        try:
            user_id = request.user.get('user_id')

            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            query = """
                SELECT c.id, c.title, c.description, c.price, c.instructor_id, 
                       c.category, u.username as instructor_name
                FROM courses c
                JOIN enrollments e ON c.id = e.course_id
                JOIN custom_users u ON c.instructor_id = u.id
                WHERE e.user_id = %s
            """
            cursor.execute(query, (user_id,))
            courses = cursor.fetchall()

            cursor.close()
            conn.close()

            logger.info(f"Enrolled courses retrieved for user ID {user_id}")
            return Response(courses, status=status.HTTP_200_OK)

        except mysql.connector.Error as e:
            logger.error(f"Database error during enrolled courses retrieval: {str(e)}")
            return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during enrolled courses retrieval: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RateCourseView(APIView):
    @jwt_required
    def post(self, request, course_id):
        try:
            user_id = request.user.get('user_id')
            role = request.user.get('role')

            if role != 'student':
                logger.warning(f"Unauthorized rating attempt by user ID {user_id}")
                return Response({"error": "Only students can rate courses"}, status=status.HTTP_403_FORBIDDEN)

            data = json.loads(request.body)
            rating = data.get('rating')
            review = data.get('review', '')

            if not rating or not isinstance(rating, (int, float)) or rating < 1 or rating > 5:
                logger.warning(f"Invalid rating value: {rating}")
                return Response({"error": "Rating must be between 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)

            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            # Check if the course exists
            cursor.execute("SELECT id FROM courses WHERE id = %s", (course_id,))
            if not cursor.fetchone():
                cursor.close()
                conn.close()
                logger.warning(f"Course not found for rating: ID {course_id}")
                return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

            # Check if the user is enrolled
            cursor.execute(
                "SELECT id FROM enrollments WHERE user_id = %s AND course_id = %s",
                (user_id, course_id)
            )
            if not cursor.fetchone():
                cursor.close()
                conn.close()
                logger.warning(f"User ID {user_id} not enrolled in Course ID {course_id}")
                return Response({"error": "You must be enrolled to rate this course"}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the user already rated this course
            cursor.execute(
                "SELECT id FROM ratings WHERE user_id = %s AND course_id = %s",
                (user_id, course_id)
            )
            if cursor.fetchone():
                cursor.close()
                conn.close()
                logger.warning(f"User ID {user_id} already rated Course ID {course_id}")
                return Response({"error": "You have already rated this course"}, status=status.HTTP_400_BAD_REQUEST)

            # Add the rating
            cursor.execute(
                """
                INSERT INTO ratings (user_id, course_id, rating, review, rated_at)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (user_id, course_id, int(rating), review, datetime.now())
            )
            conn.commit()

            cursor.close()
            conn.close()

            logger.info(f"User ID {user_id} rated Course ID {course_id}")
            return Response({"message": "Rating submitted successfully"}, status=status.HTTP_200_OK)

        except mysql.connector.Error as e:
            logger.error(f"Database error during rating submission: {str(e)}")
            return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during rating submission: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CourseRatingsView(APIView):
    def get(self, request, course_id):
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            # Check if the course exists
            cursor.execute("SELECT id FROM courses WHERE id = %s", (course_id,))
            if not cursor.fetchone():
                cursor.close()
                conn.close()
                logger.warning(f"Course not found for ratings: ID {course_id}")
                return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

            # Retrieve ratings for the course
            query = """
                SELECT r.id, r.user_id, r.course_id, r.rating, r.review, r.rated_at, 
                       u.username
                FROM ratings r
                JOIN custom_users u ON r.user_id = u.id
                WHERE r.course_id = %s
                ORDER BY r.rated_at DESC
            """
            cursor.execute(query, (course_id,))
            ratings = cursor.fetchall()

            cursor.close()
            conn.close()

            logger.info(f"Ratings retrieved for Course ID {course_id}")
            return Response(ratings, status=status.HTTP_200_OK)

        except mysql.connector.Error as e:
            logger.error(f"Database error during ratings retrieval: {str(e)}")
            return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during ratings retrieval: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserCreatedCoursesView(APIView):
    @jwt_required
    def get(self, request):
        try:
            user_id = request.user.get('user_id')
            role = request.user.get('role')

            if role != 'instructor':
                logger.warning(f"Unauthorized access to created courses by user ID {user_id}")
                return Response({"error": "Only instructors can view their created courses"}, status=status.HTTP_403_FORBIDDEN)

            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            query = """
                SELECT id, title, description, price, category, created_at, updated_at
                FROM courses
                WHERE instructor_id = %s
            """
            cursor.execute(query, (user_id,))
            courses = cursor.fetchall()

            cursor.close()
            conn.close()

            logger.info(f"Created courses retrieved for instructor ID {user_id}")
            return Response(courses, status=status.HTTP_200_OK)

        except mysql.connector.Error as e:
            logger.error(f"Database error during created courses retrieval: {str(e)}")
            return Response({"error": "Database error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error during created courses retrieval: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)