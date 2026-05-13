# payment_service

Simulated payment lifecycle service for the academic checkout flow.

## Current Scope

- Django REST Framework skeleton.
- `/health/` endpoint.
- No payment model or payment state transition logic yet.

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
