from django.urls import path
from .views import validate_statement
from . import views


urlpatterns = [
    path("validate/", validate_statement, name="validate_statement"),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
]

    

