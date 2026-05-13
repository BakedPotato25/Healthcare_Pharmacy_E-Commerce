from rest_framework.permissions import BasePermission, SAFE_METHODS

from .auth import request_is_staff_or_admin


class StaffWriteOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request_is_staff_or_admin(request)

