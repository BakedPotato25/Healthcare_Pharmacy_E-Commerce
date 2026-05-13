from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Payment
from .serializers import PaymentCreateSerializer, PaymentSerializer


class PaymentCreateView(APIView):
    def post(self, request):
        serializer = PaymentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payment = serializer.save()
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)


class PaymentDetailView(APIView):
    def get(self, request, payment_id):
        payment = get_object_or_404(Payment, id=payment_id)
        return Response(PaymentSerializer(payment).data)


class PaymentConfirmView(APIView):
    def post(self, request, payment_id):
        payment = get_object_or_404(Payment, id=payment_id)
        payment.confirm()
        return Response(PaymentSerializer(payment).data)


class PaymentCancelView(APIView):
    def post(self, request, payment_id):
        payment = get_object_or_404(Payment, id=payment_id)
        payment.cancel()
        return Response(PaymentSerializer(payment).data)
