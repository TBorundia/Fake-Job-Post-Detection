from django.urls import path
from .views import validate_statement

urlpatterns = [
    path("validate/", validate_statement, name="validate_statement"),
]
