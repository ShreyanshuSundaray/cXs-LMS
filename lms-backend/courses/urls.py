# from django.urls import path
# from .views import (
#     CourseCreateView,
#     CourseListView,
#     CourseDetailView,
#     EnrollView,
#     EnrolledCoursesView,
#     RateCourseView,
#     CourseRatingsView,
#     UserCreatedCoursesView,
# )

# urlpatterns = [
#     path('courses/create/', CourseCreateView.as_view(), name='course-create'),
#     path('courses/', CourseListView.as_view(), name='course-list'),
#     path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
#     path('courses/enroll/<int:course_id>/', EnrollView.as_view(), name='enroll'),
#     path('enrolled-courses/', EnrolledCoursesView.as_view(), name='enrolled-courses'),
#     path('courses/rate/<int:course_id>/', RateCourseView.as_view(), name='rate-course'),
#     path('courses/ratings/<int:course_id>/', CourseRatingsView.as_view(), name='course-ratings'),
#     path('created-courses/', UserCreatedCoursesView.as_view(), name='created-courses'),
# ]



from django.urls import path
import logging
from .views import (
    CourseCreateView,
    CourseListView,
    CourseDetailView,
    EnrollView,
    EnrolledCoursesView,
    RateCourseView,
    CourseRatingsView,
    UserCreatedCoursesView,
)

logger = logging.getLogger(__name__)

logger.info("Loading URL patterns for courses app")

urlpatterns = [
    path('create/', CourseCreateView.as_view(), name='course-create'),
    path('', CourseListView.as_view(), name='course-list'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('enroll/<int:course_id>/', EnrollView.as_view(), name='enroll'),
    path('enrolled-courses/', EnrolledCoursesView.as_view(), name='enrolled-courses'),
    path('rate/<int:course_id>/', RateCourseView.as_view(), name='rate-course'),
    path('ratings/<int:course_id>/', CourseRatingsView.as_view(), name='course-ratings'),
    path('created-courses/', UserCreatedCoursesView.as_view(), name='created-courses'),
]

logger.info("URL patterns loaded in courses/urls.py: %s", [str(pattern) for pattern in urlpatterns])