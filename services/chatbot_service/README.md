# chatbot_service

Safe product consultation and recommendation service for the pharmacy assistant.

## Current Scope

- Django REST Framework skeleton.
- `/health/` endpoint.
- No model artifact loading, chatbot inference, or recommendation logic yet.

## Local Setup

```powershell
cd services/chatbot_service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py runserver 8006
```

## Health Check

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8006/health/
```

Expected response:

```json
{
  "service": "chatbot_service",
  "status": "ok"
}
```
