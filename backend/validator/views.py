# from django.shortcuts import render

# # Create your views here.




from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from .models import UserProfile


@csrf_exempt
def validate_statement(request):
    if request.method == "POST":
        data = json.loads(request.body)
        text = data.get("text", "")
        if text == "Hii":
            return JsonResponse({"message": "Valid statement!"})
        else:
            return JsonResponse({"message": "Invalid statement."})



def login_view(request):
    return render(request, 'login.html')

def register_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        phone = request.POST['phone']
        dob = request.POST['dob']
        
        # Check if passwords match
        if password != confirm_password:
            messages.error(request, "Passwords do not match!")
            return redirect('register')

        # Check if the email already exists
        if User.objects.filter(email=email).exists():
            messages.error(request, "Email is already registered!")
            return redirect('register')

        # Create the user
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        # Create the UserProfile
        profile = UserProfile.objects.create(user=user, phone=phone, dob=dob)
        profile.save()

        messages.success(request, "Account created successfully!")
        return redirect('login')

    return render(request, 'register.html')

