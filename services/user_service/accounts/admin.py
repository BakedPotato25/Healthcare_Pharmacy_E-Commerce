from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomerProfile, StaffProfile, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (("Role", {"fields": ("role",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + (("Role", {"fields": ("email", "role")}),)
    list_display = ("id", "email", "username", "role", "is_active", "is_staff")
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("email", "username")


admin.site.register(CustomerProfile)
admin.site.register(StaffProfile)

