# user_service

Identity service for customer, staff, and admin authentication boundaries.

## Current Scope

- Django REST Framework skeleton.
- `/health/` endpoint.
- No authentication, user models, JWT, or role logic yet.

## Local Setup

```powershell
cd services/user_service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py runserver 8001
```

## Health Check

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8001/health/
```

Expected response:

```json
{
  "service": "user_service",
  "status": "ok"
}
```
