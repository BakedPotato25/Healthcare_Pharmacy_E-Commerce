from django.urls import path

from .views import ShipmentCreateView, ShipmentDetailView, ShipmentStatusUpdateView

urlpatterns = [
    path("shipments/", ShipmentCreateView.as_view(), name="shipment-create"),
    path("shipments/<int:shipment_id>/", ShipmentDetailView.as_view(), name="shipment-detail"),
    path("shipments/<int:shipment_id>/status/", ShipmentStatusUpdateView.as_view(), name="shipment-status-update"),
]
