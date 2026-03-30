from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserSerializer, RegisterSerializer

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role,
                    "avatar_url": user.avatar_url,
                }
            }, status=201)
        return Response(serializer.errors, status=400)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
            if not user.check_password(password):
                return Response({"error": "Invalid credentials"}, status=401)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=401)

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "avatar_url": user.avatar_url,
            }
        })


class ProfileUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        # Accept both API-style fields (full_name/avatar_url) and frontend fields (firstName/lastName).
        data = request.data.copy()

        first = data.get("firstName") or data.get("first_name")
        last = data.get("lastName") or data.get("last_name")
        name = data.get("name")
        if (first or last) and not data.get("full_name"):
            full_name = " ".join([p for p in [first, last] if p]).strip()
            if full_name:
                data["full_name"] = full_name
        elif name and not data.get("full_name"):
            data["full_name"] = name

        # Only allow fields supported by the User model/serializer; ignore extra UI fields.
        allowed = {"email", "full_name", "avatar_url", "telegram_chat_id"}
        filtered = {k: data.get(k) for k in allowed if k in data}

        serializer = UserSerializer(user, data=filtered, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "user": serializer.data
            })
        return Response(serializer.errors, status=400)
