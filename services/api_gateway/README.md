# api_gateway

Dedicated public API entry point for the Healthcare Pharmacy E-Commerce microservices system.

## Current Scope

- Django REST Framework skeleton.
- `/health/` endpoint.
- Generic API forwarding for the MVP microservices.
- `/health/services/` downstream health aggregation.
- Basic request logging.
- Lightweight CORS support for the Vite frontend.

The API Gateway does not implement business rules. It receives frontend requests,
selects the target service from the route prefix, forwards the request, and
returns the downstream response.

## Route Mapping

| Gateway route | Target service |
|---|---|
| `/api/auth/*` | `user_service` |
| `/api/users/*` | `user_service` |
| `/api/categories/*` | `product_service` |
| `/api/products/*` | `product_service` |
| `/api/cart/*` | `order_service` |
| `/api/orders/*` | `order_service` |
| `/api/payments/*` | `payment_service` |
| `/api/shipments/*` | `shipping_service` |
| `/api/chat/*` | `chatbot_service` |

The gateway forwards request method, body, query string, content type, and
`Authorization` headers. Internal service URLs stay in environment variables and
are not exposed to the frontend.

## Environment Variables

| Variable | Default |
|---|---|
| `USER_SERVICE_URL` | `http://localhost:8001` |
| `PRODUCT_SERVICE_URL` | `http://localhost:8002` |
| `ORDER_SERVICE_URL` | `http://localhost:8003` |
| `PAYMENT_SERVICE_URL` | `http://localhost:8004` |
| `SHIPPING_SERVICE_URL` | `http://localhost:8005` |
| `CHATBOT_SERVICE_URL` | `http://localhost:8006` |
| `GATEWAY_REQUEST_TIMEOUT_SECONDS` | `10` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` |
| `CORS_ALLOW_ALL_ORIGINS` | `False` |

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
Invoke-WebRequest -UseBasicParsing http://localhost:8000/health/services/
```

Expected response:

```json
{
  "service": "api_gateway",
  "status": "ok"
}
```

## Forwarding Checks

For the current skeleton phase, use the gateway health aggregation endpoint to
verify that the gateway can reach each downstream service:

```powershell
curl.exe http://localhost:8000/health/services/
```

These route checks confirm that the gateway forwards to the correct downstream
service. They will return downstream `404` responses until the later service
phases add the matching business APIs:

```powershell
curl.exe -i http://localhost:8000/api/products/
curl.exe -i "http://localhost:8000/api/products/?search=vitamin"
curl.exe -i -H "Authorization: Bearer demo-token" http://localhost:8000/api/orders/
curl.exe -i -X POST http://localhost:8000/api/chat/ -H "Content-Type: application/json" -d "{\"message\":\"Suggest digestive support products\"}"
```
