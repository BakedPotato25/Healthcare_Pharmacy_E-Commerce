# product_service

Catalog service for healthcare categories and pharmacy products.

## Current Scope

- `/health/` endpoint.
- Category and Product catalog models.
- Public active category/product listing and detail APIs.
- Product search, filters, and sorting.
- Staff/admin-only product write operations.
- Seed command for 10 healthcare categories and 100 safe mock products.

## Local Setup

```powershell
cd services/product_service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_products
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

## Catalog APIs

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/categories/` | `GET` | List active healthcare categories |
| `/api/categories/:id/` | `GET` | Category detail |
| `/api/products/` | `GET` | List active products |
| `/api/products/:id/` | `GET` | Product detail |
| `/api/products/` | `POST` | Staff/admin create product |
| `/api/products/:id/` | `PUT` | Staff/admin replace product |
| `/api/products/:id/` | `PATCH` | Staff/admin update product |
| `/api/products/:id/` | `DELETE` | Staff/admin deactivate product |

Public and customer reads only return active products from active categories.
Staff/admin requests can filter inactive products with `is_active=false`.
Product write requests validate the forwarded JWT by calling
`user_service` `/api/auth/me/`; this keeps user data owned by `user_service`.

## Search, Filter, Sort

Supported product query parameters:

- `search`: matches product name or brand.
- `category`: category id or slug.
- `brand`: exact brand match.
- `min_price`: minimum price.
- `max_price`: maximum price.
- `is_active`: staff/admin only.
- `sort`: `price`, `-price`, `name`, or `-name`.

## Seed Data

```powershell
python manage.py seed_products
```

The command is idempotent and creates:

- 10 healthcare/pharmacy categories.
- 100 safe mock products.

The seed data avoids prescription workflows and medical cure claims.

## Curl Checks Through API Gateway

```powershell
curl.exe http://localhost:8000/api/categories/
curl.exe http://localhost:8000/api/products/
curl.exe "http://localhost:8000/api/products/?search=vitamin"
curl.exe "http://localhost:8000/api/products/?category=vitamins-minerals&sort=price"
curl.exe "http://localhost:8000/api/products/?brand=VitaCore&min_price=5&max_price=15"
curl.exe -X POST http://localhost:8000/api/products/ -H "Authorization: Bearer <staff_access_token>" -H "Content-Type: application/json" -d "{\"category\":1,\"name\":\"Staff Demo Product\",\"brand\":\"DemoCare\",\"description\":\"General catalog product for staff API verification.\",\"price\":\"5.25\",\"stock\":12,\"is_active\":true}"
```

## Verify Counts

```powershell
python manage.py shell -c "from catalog.models import Category, Product; print(Category.objects.count(), Product.objects.count())"
```
