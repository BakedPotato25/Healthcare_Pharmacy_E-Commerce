# order_service

Commerce service for cart, checkout, order history, and order item snapshots.

## Current Scope

- Django REST Framework skeleton.
- `/health/` endpoint.
- No cart, checkout, order models, or service-to-service calls yet.

## Local Setup

```powershell
cd services/order_service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py runserver 8003
```

## Health Check

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8003/health/
```

Expected response:

```json
{
  "service": "order_service",
  "status": "ok"
}
```
