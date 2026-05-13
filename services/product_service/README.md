# product_service

Catalog service for healthcare categories and pharmacy products.

## Current Scope

- Django REST Framework skeleton.
- `/health/` endpoint.
- No category/product models, APIs, or seed command yet.

## Local Setup

```powershell
cd services/product_service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py runserver 8002
```

## Health Check

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8002/health/
```

Expected response:

```json
{
  "service": "product_service",
  "status": "ok"
}
```
