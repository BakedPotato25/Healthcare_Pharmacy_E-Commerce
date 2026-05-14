from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from .auth import get_user_context, require_shipment_access, require_staff_or_admin, is_staff_or_admin
from .models import Shipment
from .serializers import ShipmentCreateSerializer, ShipmentSerializer, ShipmentStatusUpdateSerializer


class ShipmentCreateView(APIView):
    def get(self, request):
        user = get_user_context(request)
        shipments = Shipment.objects.all()
        if not is_staff_or_admin(user):
            shipments = shipments.filter(user_id=user["id"])
        return Response(ShipmentSerializer(shipments, many=True).data)

    def post(self, request):
        user = get_user_context(request)
        serializer = ShipmentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not is_staff_or_admin(user) and serializer.validated_data["user_id"] != user["id"]:
            raise PermissionDenied("Customers can only create shipments for their own user ID.")

        shipment = serializer.save()
        return Response(ShipmentSerializer(shipment).data, status=status.HTTP_201_CREATED)


class ShipmentDetailView(APIView):
    def get(self, request, shipment_id):
        user = get_user_context(request)
        shipment = get_object_or_404(Shipment, id=shipment_id)
        require_shipment_access(user, shipment)
        return Response(ShipmentSerializer(shipment).data)


class ShipmentStatusUpdateView(APIView):
    def patch(self, request, shipment_id):
        user = get_user_context(request)
        require_staff_or_admin(user)
        shipment = get_object_or_404(Shipment, id=shipment_id)
        serializer = ShipmentStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        shipment.update_status(serializer.validated_data["status"])
        return Response(ShipmentSerializer(shipment).data)
