from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import models
from django.contrib.auth import get_user_model
from .serializers import LoginSerializer

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            # Assuming user credentials are valid
            user = serializer.validated_data['user']

            # Generate a refresh token and access token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Return the token to the frontend
            return Response({
                'access_token': access_token,
                'refresh_token': str(refresh),
                'message': 'Login successful',
            }, status=status.HTTP_200_OK)
        
        # If credentials are not valid, return unauthorized
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)



