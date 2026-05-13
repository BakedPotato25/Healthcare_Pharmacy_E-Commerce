# order_service

Commerce service for cart, checkout, order history, and order item snapshots.

## Current Scope

- `/health/` endpoint.
- Cart, checkout, and order history APIs.
- Cart and order item product snapshots.
- Customer-only cart and checkout actions.
- Customer order isolation and staff/admin order visibility.

Cart belongs to `order_service` for the MVP because it is part of the Commerce
Context. The service stores product snapshots instead of foreign keys to the
catalog database so old orders remain stable if product data changes later.

## Local Setup

```powershell
cd services/order_service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8003
```

## Health Check

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8003/health/
```

Expected response:

```json
{
  "service": "order_service",
  "status": "ok"
}
```

## Commerce APIs

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/cart/` | `GET` | Return current customer's cart |
| `/api/cart/items/` | `POST` | Add product to current customer's cart |
| `/api/cart/items/:id/` | `PATCH` | Update current customer's cart item quantity |
| `/api/cart/items/:id/` | `DELETE` | Remove current customer's cart item |
| `/api/cart/clear/` | `DELETE` | Clear current customer's cart |
| `/api/orders/` | `GET` | Customer own orders; staff/admin all orders |
| `/api/orders/:id/` | `GET` | Customer own order detail; staff/admin any order |
| `/api/orders/checkout/` | `POST` | Create order from current customer's cart |

All endpoints require a bearer token forwarded by the API Gateway. The service
validates the token by calling `user_service` `/api/auth/me/`.

## Product Snapshots

When a customer adds a product to cart, `order_service` fetches product detail
from `product_service` over HTTP. It stores these fields on `CartItem`:

- `product_id`
- `product_name`
- `product_brand`
- `product_category`
- `product_image_url`
- `unit_price`
- `quantity`

During checkout, those same snapshot fields are copied into `OrderItem` rows,
with `line_total`. No cross-service database foreign keys are created.

## Checkout Behavior

Checkout:

1. Validates that the customer cart is not empty.
2. Creates an `Order`.
3. Creates `OrderItem` rows from cart snapshots.
4. Stores the order total.
5. Calls `payment_service` over HTTP to create a pending payment.
6. Calls `shipping_service` over HTTP to create a pending shipment.
7. Stores `payment_id`, `payment_status`, `shipment_id`, and `shipping_status` snapshots on the order.
8. Clears the cart only after payment and shipment creation succeed.

If payment creation fails, checkout returns a validation error and the cart is not cleared.
If shipment creation fails after payment creation, checkout attempts to cancel the created payment before returning a validation error. The service does not directly access payment or shipping databases.

## Curl Checks Through API Gateway

```powershell
curl.exe http://localhost:8000/api/cart/ -H "Authorization: Bearer <customer_access_token>"

curl.exe -X POST http://localhost:8000/api/cart/items/ -H "Authorization: Bearer <customer_access_token>" -H "Content-Type: application/json" -d "{\"product_id\":1,\"quantity\":2}"

curl.exe -X PATCH http://localhost:8000/api/cart/items/1/ -H "Authorization: Bearer <customer_access_token>" -H "Content-Type: application/json" -d "{\"quantity\":3}"

curl.exe -X DELETE http://localhost:8000/api/cart/items/1/ -H "Authorization: Bearer <customer_access_token>"

curl.exe -X POST http://localhost:8000/api/orders/checkout/ -H "Authorization: Bearer <customer_access_token>" -H "Content-Type: application/json" -d "{\"shipping_address\":\"123 Demo Street\",\"recipient_name\":\"Demo Customer\",\"phone\":\"555-0101\"}"

curl.exe http://localhost:8000/api/orders/ -H "Authorization: Bearer <customer_access_token>"

curl.exe http://localhost:8000/api/orders/ -H "Authorization: Bearer <staff_access_token>"
```
