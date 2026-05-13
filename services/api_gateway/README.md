# api_gateway

Dedicated public API entry point for the Healthcare Pharmacy E-Commerce microservices system.

## Current Scope

- Django REST Framework skeleton.
- `/health/` endpoint.
- No gateway forwarding or business logic yet.

## Local Setup

```powershell
cd services/api_gateway
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py runserver 8000
```

## Health Check

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8000/health/
```

Expected response:

```json
{
  "service": "api_gateway",
  "status": "ok"
}
```
