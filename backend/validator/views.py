# from django.shortcuts import render

# # Create your views here.




from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def validate_statement(request):
    if request.method == "POST":
        data = json.loads(request.body)
        text = data.get("text", "")
        if text == "Hii":
            return JsonResponse({"message": "Valid statement!"})
        else:
            return JsonResponse({"message": "Invalid statement."})
