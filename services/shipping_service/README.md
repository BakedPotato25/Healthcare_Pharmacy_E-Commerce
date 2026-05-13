# shipping_service

Shipment lifecycle service for delivery tracking and staff-managed shipping status.

## Current Scope

- Django REST Framework shipping context.
- `/health/` endpoint.
- Shipment creation, detail, and staff-managed status updates.
- No direct access to `order_service` data. Shipments store external `order_id` and `user_id` values only.

## Shipment Lifecycle

New shipments always start as `pending`.

Allowed statuses:

- `pending`
- `preparing`
- `shipped`
- `delivered`
- `cancelled`

Allowed MVP transitions:

- `pending -> preparing`
- `pending -> cancelled`
- `preparing -> shipped`
- `preparing -> cancelled`
- `shipped -> delivered`

Terminal statuses:

- `delivered`
- `cancelled`

## APIs

When called through the API Gateway, use:

- `POST /api/shipments/`
- `GET /api/shipments/:id/`
- `PATCH /api/shipments/:id/status/`

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
