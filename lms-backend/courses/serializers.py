from rest_framework import serializers
from .models import Course, Enrollment, Lesson, Quiz, Question, UserQuizAttempt, UserProgress, Review
from users.serializers import CustomUserSerializer

class CourseSerializer(serializers.ModelSerializer):
    instructor = CustomUserSerializer(read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'price', 'instructor', 'created_at', 'updated_at']

class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'course', 'enrolled_at']

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'course', 'title', 'lesson_type', 'content', 'duration', 'order']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'correct_answer', 'options']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'lesson', 'title', 'questions']

class UserQuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuizAttempt
        fields = ['id', 'user', 'quiz', 'score', 'total_questions', 'attempted_at']

class UserProgressSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)

    class Meta:
        model = UserProgress
        fields = ['id', 'user', 'lesson', 'completed', 'completed_at']

class ReviewSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'course', 'rating', 'comment', 'created_at']