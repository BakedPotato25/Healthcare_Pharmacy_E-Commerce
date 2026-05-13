from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import CustomerProfile, StaffProfile

User = get_user_model()


DEMO_USERS = [
    {
        "email": "customer@example.com",
        "username": "customer",
        "role": User.Role.CUSTOMER,
        "is_staff": False,
        "is_superuser": False,
    },
    {
        "email": "staff@example.com",
        "username": "staff",
        "role": User.Role.STAFF,
        "is_staff": True,
        "is_superuser": False,
    },
    {
        "email": "admin@example.com",
        "username": "admin",
        "role": User.Role.ADMIN,
        "is_staff": True,
        "is_superuser": True,
    },
]


class Command(BaseCommand):
    help = "Create or update demo customer, staff, and admin accounts."

    @transaction.atomic
    def handle(self, *args, **options):
        password = "Password123!"

        for user_data in DEMO_USERS:
            user, created = User.objects.get_or_create(
                email=user_data["email"],
                defaults={
                    "username": user_data["username"],
                    "role": user_data["role"],
                    "is_staff": user_data["is_staff"],
                    "is_superuser": user_data["is_superuser"],
                },
            )
            user.username = user_data["username"]
            user.role = user_data["role"]
            user.is_staff = user_data["is_staff"]
            user.is_superuser = user_data["is_superuser"]
            user.set_password(password)
            user.save()

            if user.role == User.Role.CUSTOMER:
                CustomerProfile.objects.get_or_create(user=user)
            else:
                StaffProfile.objects.get_or_create(user=user)

            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{action} {user.email} ({user.role})"))
