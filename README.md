# Healthcare Pharmacy E-Commerce Microservices System

Academic demo project for a Healthcare Pharmacy E-Commerce system built with
Django REST Framework microservices, a dedicated API Gateway, a React + Vite
frontend, and a safe ML-backed chatbot trained from self-seeded data.

This is not a production pharmacy or medical system. The chatbot and seed data
are for software architecture demonstration only and are not clinically
validated.

## Architecture

The MVP uses REST communication:

```text
frontend -> api_gateway -> backend service
order_service -> payment_service over HTTP
order_service -> shipping_service over HTTP
order_service -> product_service over HTTP for product snapshots
```

The frontend must call only `VITE_API_BASE_URL=http://localhost:8000`. Internal
service ports are hidden behind the gateway.

## Services

| Service | Port | Responsibility |
|---|---:|---|
| `api_gateway` | 8000 | Public API entry point, request forwarding, health aggregation |
| `user_service` | 8001 | Customer/staff/admin users, JWT auth, roles |
| `product_service` | 8002 | 10 categories and 100 healthcare products |
| `order_service` | 8003 | Cart, checkout, orders, product snapshots |
| `payment_service` | 8004 | Simulated pending/paid/cancelled payments |
| `shipping_service` | 8005 | Simulated shipment tracking and staff status updates |
| `chatbot_service` | 8006 | ML-backed safe product consultation |
| `frontend` | 5173 | React + Vite customer and staff UI |

## Demo Accounts

Create or refresh these accounts with `python manage.py seed_demo_users` in
`user_service`.

| Role | Email | Password |
|---|---|---|
| Customer | `customer@example.com` | `Password123!` |
| Staff | `staff@example.com` | `Password123!` |
| Admin | `admin@example.com` | `Password123!` |

These credentials are for local demo only.

## Run Backend With Docker Compose

From the repository root:

```powershell
docker compose up --build
```

For a detached run:

```powershell
docker compose up --build -d
```

On a fresh container build, run migrations and seed demo data:

```powershell
docker compose exec -T user_service python manage.py migrate
docker compose exec -T product_service python manage.py migrate
docker compose exec -T order_service python manage.py migrate
docker compose exec -T payment_service python manage.py migrate
docker compose exec -T shipping_service python manage.py migrate

docker compose exec -T user_service python manage.py seed_demo_users
docker compose exec -T product_service python manage.py seed_products
```

The current Docker setup uses per-container SQLite databases for demo
simplicity. If containers are recreated, rerun migrations and seed commands.

## Run Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev -- --host 0.0.0.0
```

Open:

```text
http://localhost:5173
```

The frontend reads:

```text
VITE_API_BASE_URL=http://localhost:8000
```

Build check:

```powershell
cd frontend
npm run build
```

## Seed Products

With Docker:

```powershell
docker compose exec -T product_service python manage.py seed_products
```

Locally:

```powershell
cd services/product_service
python manage.py migrate
python manage.py seed_products
```

The command is idempotent and creates 10 categories and 100 safe mock products.
The catalog avoids prescription validation workflows and medical cure claims.

## API Gateway Routes

| Gateway route | Target |
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

## Verification Commands

PowerShell GET checks:

```powershell
curl.exe http://localhost:8000/health/
curl.exe http://localhost:8000/health/services/
curl.exe http://localhost:8000/api/products/
```

PowerShell POST checks with `curl.exe --%`:

```powershell
curl.exe --% -X POST http://localhost:8000/api/auth/login/ -H "Content-Type: application/json" -d "{""email"":""customer@example.com"",""password"":""Password123!"",""role"":""customer""}"
curl.exe --% -X POST http://localhost:8000/api/chat/ -H "Content-Type: application/json" -d "{""message"":""Suggest something for digestive support""}"
```

Bash equivalent:

```bash
curl http://localhost:8000/health/
curl http://localhost:8000/api/products/
curl -X POST http://localhost:8000/api/auth/login/ -H "Content-Type: application/json" -d '{"email":"customer@example.com","password":"Password123!","role":"customer"}'
curl -X POST http://localhost:8000/api/chat/ -H "Content-Type: application/json" -d '{"message":"Suggest something for digestive support"}'
```

## Main Demo Flow

1. Start the backend with Docker Compose.
2. Run migrations, `seed_demo_users`, and `seed_products`.
3. Start the frontend with `npm run dev -- --host 0.0.0.0`.
4. Customer logs in at `/customer/login`.
5. Customer browses `/customer/products`.
6. Customer adds a product to cart.
7. Customer checks out with a shipping address.
8. `order_service` creates the order and order item snapshots.
9. `payment_service` creates a `pending` payment.
10. `shipping_service` creates a `pending` shipment.
11. Staff logs in at `/staff/login`.
12. Staff updates shipment status on `/staff/shipping`.
13. Customer views order history and shipment tracking.
14. Customer asks the chatbot for a product consultation.
15. Chatbot predicts an intent/category using trained artifacts and returns a
    safe recommendation with a medical disclaimer when needed.

## Chatbot Training

The ML baseline is stored under `ml/`.

Generate datasets:

```powershell
python ml/generate_chatbot_datasets.py
```

Train locally:

```powershell
python ml/train_chatbot.py
```

Train on Kaggle:

1. Upload the repository or `ml/datasets/` files to Kaggle.
2. Open `ml/notebooks/kaggle_train_chatbot.ipynb`.
3. Run all notebook cells.
4. Download the exported artifacts from `ml/artifacts/`.

Required artifacts:

```text
intent_model.pkl
intent_vectorizer.pkl
category_model.pkl
category_vectorizer.pkl
label_encoders.pkl
model_metadata.json
metrics.json
```

Copy artifacts into the chatbot service:

```powershell
Copy-Item ml\artifacts\* services\chatbot_service\artifacts\ -Force
docker compose up --build -d chatbot_service
```

The chatbot loads artifacts from `services/chatbot_service/artifacts/`. If
artifacts are missing or fail to load, the service returns a safe fallback
instead of crashing.

## Design References

Google Stitch exports live under `docs/stitch/` and are references only:

- `docs/stitch/DESIGN.md` defines the design direction.
- `docs/stitch/README.md` maps Stitch screens to React routes.
- `docs/stitch/raw_export/` stores exported `screen.png` and `code.html`.

Do not paste Stitch `code.html` directly into React production files. The React
frontend converts the visual references into components and pages.

## Architecture Notes

Cart is inside `order_service` because cart, checkout, and order history are one
Commerce bounded context for the MVP.

Order items store product snapshots, not cross-service foreign keys, so old
orders remain stable when catalog data changes.

Each service owns its own database. Services communicate by HTTP API instead of
reading another service database directly.

The API Gateway keeps public routing and internal service URLs separate, which
makes the frontend simpler and preserves service boundaries.

The chatbot uses self-seeded training data because the project must avoid real
patient data and sensitive health records.

## Known Limitations

- SQLite databases are used for local academic demo; there is no persistent
  production database setup.
- Docker Compose does not run migrations automatically yet.
- Payment is simulated only; no real payment provider is integrated.
- Shipping is simulated only; no carrier API is integrated.
- Checkout uses synchronous HTTP calls. A future version could use Saga,
  outbox, or message broker patterns.
- Shipment status is updated in `shipping_service`; existing order records keep
  their checkout-time `shipping_status` snapshot unless the UI/API reads the
  shipment endpoint.
- The chatbot is a TF-IDF + Logistic Regression baseline trained on synthetic
  data. It is not medical advice and is not clinically validated.
- Product images are placeholder URLs.
