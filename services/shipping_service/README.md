# shipping_service

Shipment lifecycle service for delivery tracking and staff-managed shipping status.

## Current Scope

- Django REST Framework skeleton.
- `/health/` endpoint.
- No shipment model or status transition logic yet.

## Local Setup

```powershell
cd services/shipping_service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py runserver 8005
```

## Health Check

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8005/health/
```

Expected response:

```json
{
  "service": "shipping_service",
  "status": "ok"
}
```
