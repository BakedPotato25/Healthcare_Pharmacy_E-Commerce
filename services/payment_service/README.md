# payment_service

Simulated payment lifecycle service for the academic checkout flow.

## Current Scope

- Django REST Framework payment context.
- `/health/` endpoint.
- Simulated payment creation, detail, confirmation, and cancellation.
- No real payment provider integration.
- No direct access to `order_service` data. Payments store external `order_id` and `user_id` values only.

## Payment Lifecycle

New payments always start as `pending`.

Allowed statuses:

- `pending`
- `paid`
- `failed`
- `cancelled`

Allowed MVP transitions:

- `pending -> paid`
- `pending -> cancelled`

Rejected transitions:

- `paid -> cancelled`
- `cancelled -> paid`
- Any non-pending payment confirmation or cancellation.

## APIs

When called through the API Gateway, use:

- `POST /api/payments/`
- `GET /api/payments/:id/`
- `POST /api/payments/:id/confirm/`
- `POST /api/payments/:id/cancel/`

## Local Setup

```powershell
cd services/payment_service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py runserver 8004
```

## Health Check

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8004/health/
```

Expected response:

```json
{
  "service": "payment_service",
  "status": "ok"
}
```
