from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("ADMIN", "Admin"),
        ("LAWYER", "Lawyer"),
        ("STUDENT_LAWYER", "Student Lawyer"),
        ("JUDGE", "Judge"),
        ("RESEARCHER", "Researcher"),
    )

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    telegram_chat_id = models.CharField(
        max_length=50, blank=True, null=True
    )

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name", "role"]

    def __str__(self):
        return self.email



