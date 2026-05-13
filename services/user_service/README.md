# user_service

Identity service for customer, staff, and admin authentication boundaries.

## Current Scope

- Django REST Framework skeleton.
- `/health/` endpoint.
- Custom `accounts.User` model with `customer`, `staff`, and `admin` roles.
- JWT login, refresh, and authenticated profile endpoint.
- Customer registration.
- Demo account seed command.
- Reusable backend role permission classes.

## Local Setup

```powershell
cd services/user_service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_users
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

## Auth APIs

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/register/` | `POST` | Register a customer account |
| `/api/auth/login/` | `POST` | Login customer, staff, or admin |
| `/api/auth/token/refresh/` | `POST` | Refresh JWT access token |
| `/api/auth/me/` | `GET` | Return the authenticated user |
| `/api/users/` | `GET` | Staff/admin-only user list |

Customer registration always creates a `customer` role. Staff and admin accounts
are seeded or created through Django admin so customers cannot self-register as
staff.

## Demo Accounts

```powershell
python manage.py seed_demo_users
```

| Role | Email | Password |
|---|---|---|
| Customer | `customer@example.com` | `Password123!` |
| Staff | `staff@example.com` | `Password123!` |
| Admin | `admin@example.com` | `Password123!` |

## Curl Checks

Through the API Gateway:

```powershell
curl.exe -X POST http://localhost:8000/api/auth/register/ -H "Content-Type: application/json" -d "{\"email\":\"new.customer@example.com\",\"username\":\"newcustomer\",\"password\":\"Password123!\"}"
curl.exe -X POST http://localhost:8000/api/auth/login/ -H "Content-Type: application/json" -d "{\"email\":\"customer@example.com\",\"password\":\"Password123!\",\"role\":\"customer\"}"
curl.exe -X POST http://localhost:8000/api/auth/login/ -H "Content-Type: application/json" -d "{\"email\":\"staff@example.com\",\"password\":\"Password123!\",\"role\":\"staff\"}"
curl.exe -H "Authorization: Bearer <access_token>" http://localhost:8000/api/auth/me/
curl.exe -X POST http://localhost:8000/api/auth/token/refresh/ -H "Content-Type: application/json" -d "{\"refresh\":\"<refresh_token>\"}"
curl.exe -H "Authorization: Bearer <staff_access_token>" http://localhost:8000/api/users/
```
