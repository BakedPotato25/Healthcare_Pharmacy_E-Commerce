# chatbot_service

Safe product consultation and recommendation service for the pharmacy assistant.

## Current Scope

- Django REST Framework skeleton.
- `/health/` endpoint.
- Lazy loading for trained TF-IDF + Logistic Regression chatbot artifacts.
- Safe fallback responses when artifacts are missing or inference fails.
- `/api/chat/` and `/api/chat/recommend/` endpoints.
- Product suggestions are retrieved from `product_service` through HTTP.

## Artifact Loading

The service loads artifacts from `CHATBOT_ARTIFACT_DIR`, which defaults to:

```text
services/chatbot_service/artifacts/
```

Expected files:

- `intent_model.pkl`
- `intent_vectorizer.pkl`
- `category_model.pkl`
- `category_vectorizer.pkl`
- `label_encoders.pkl`
- `model_metadata.json`
- `metrics.json`

Artifacts are loaded lazily on the first chatbot request. If any file is missing
or loading fails, the service logs the problem and returns safe rule-based
fallback guidance instead of crashing.

The chatbot is for academic product consultation only. It must not diagnose
disease, claim that products cure diseases, or replace advice from a doctor or
pharmacist.

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

## Chat API

```powershell
curl.exe -X POST http://localhost:8006/api/chat/ -H "Content-Type: application/json" -d "{\"message\":\"Suggest something for digestive support\"}"
```

Via API Gateway:

```powershell
curl.exe -X POST http://localhost:8000/api/chat/ -H "Content-Type: application/json" -d "{\"message\":\"Suggest something for digestive support\"}"
```

Recommendation endpoint:

```powershell
curl.exe -X POST http://localhost:8006/api/chat/recommend/ -H "Content-Type: application/json" -d "{\"category\":\"Digestive Health\"}"
```
