from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate  # Add this import
from accounts.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import update_last_login
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils.timezone import now
from accounts.models import LoginHistory
import datetime

import json

@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # Parse JSON data from request body
            username = data.get("username")
            password = data.get("password")
            email = data.get("email")

            if not all([username, password, email]):
                return JsonResponse({"error": "Missing fields!"}, status=400)

            # Check if user already exists
            if CustomUser.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already taken!"}, status=400)

            # Create the user securely
            user = CustomUser.objects.create_user(username=username, email=email, password=password)
            return JsonResponse({"message": "User created successfully!"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format!"}, status=400)

    return JsonResponse({"error": "Invalid request method!"}, status=405)




def get_tokens_for_user(user):
    """Générer les tokens JWT pour un utilisateur"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@csrf_exempt
def get_client_ip(request):
    """ Get client IP address """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@api_view(['POST'])
def login_user(request):
    """ Login API with tracking """
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(email=email, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        
        # Update last login timestamp
        update_last_login(None, user)

        # Save login history
        LoginHistory.objects.create(
            user=user,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT'),
            timestamp=now()
        )
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': "Login successful"
        }, status=200)
    
    return Response({'error': 'Invalid credentials'}, status=400)
