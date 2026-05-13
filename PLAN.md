# PLAN.md

## Project Name

Healthcare Pharmacy E-Commerce Microservices System

---

## Main Objective

Build a working healthcare/pharmacy e-commerce web system using Django microservices, a dedicated API Gateway, a React + Vite frontend, Google Stitch UI design references, and a trained chatbot model based on self-seeded data.

The source code will later be used as evidence for a Software Architecture and Design essay about:

- Monolithic vs Microservices
- Domain-Driven Design
- Bounded Contexts
- Database-per-service
- API Gateway
- Customer/staff role separation
- Product catalog
- Order/payment/shipping workflow
- AI chatbot trained from self-seeded data
- Kaggle-based model training
- Safe healthcare/pharmacy product consultation
- UI implementation from a design system

---

## Target Architecture

Frontend:

- React + Vite
- Tailwind CSS
- Google Stitch design references

Backend:

- Django REST Framework microservices

Gateway:

- Dedicated `api_gateway` service

ML:

- Self-seeded dataset
- Kaggle training notebook
- Exported model artifacts
- Integrated chatbot service

High-level architecture:

- Frontend React + Vite
- API Gateway
- User Service
- Product Service
- Order Service
- Payment Service
- Shipping Service
- Chatbot Service

---

## Required Folder Structure

The root folder should be:

- `AGENTS.md`
- `PLAN.md`
- `README.md`
- `docker-compose.yml`
- `docs/`
- `docs/stitch/`
- `docs/stitch/DESIGN.md`
- `docs/stitch/README.md`
- `docs/stitch/raw_export/`
- `services/`
- `services/api_gateway/`
- `services/user_service/`
- `services/product_service/`
- `services/order_service/`
- `services/payment_service/`
- `services/shipping_service/`
- `services/chatbot_service/`
- `frontend/`
- `ml/`
- `ml/datasets/`
- `ml/notebooks/`
- `ml/artifacts/`
- `ml/reports/`

---

## Domain Decomposition

| Bounded Context | Service | Main Responsibility |
|---|---|---|
| Gateway Context | `api_gateway` | Public entry point, routing, request forwarding |
| Identity Context | `user_service` | Authentication, users, roles, profiles |
| Catalog Context | `product_service` | Healthcare categories and products |
| Commerce Context | `order_service` | Cart, checkout, orders, order items |
| Payment Context | `payment_service` | Simulated payment lifecycle |
| Shipping Context | `shipping_service` | Shipment lifecycle and status |
| AI Assistant Context | `chatbot_service` | Safe chatbot, intent prediction, category recommendation |
| UI Context | `frontend` | Customer/staff user interface based on Stitch design |

---

## MVP Scope

The MVP must support:

1. Google Stitch UI references organized under `docs/stitch/`
2. React + Vite frontend skeleton
3. Customer mock UI based on Stitch
4. Staff mock UI based on Stitch
5. Customer registration/login
6. Staff login
7. Separate customer/staff login pages
8. Product catalog with 10 categories and 100 products
9. Customer product browsing
10. Product search/filter
11. Cart management
12. Checkout
13. Simulated payment
14. Shipping status
15. Staff dashboard
16. Staff product management
17. Staff order/shipping management
18. Self-seeded chatbot dataset
19. Kaggle chatbot training notebook
20. Trained chatbot model artifacts
21. Chatbot service integration
22. Docker Compose startup
23. API Gateway routing
24. End-to-end demo flow

---

# Phase 0 — Import Google Stitch Design References

## Goal

Store Google Stitch UI exports as design references for frontend implementation.

## Tasks

- Create `docs/stitch/`.
- Create `docs/stitch/raw_export/`.
- Copy all Google Stitch exported folders into `docs/stitch/raw_export/`.
- Copy the design system markdown file into `docs/stitch/DESIGN.md`.
- Create `docs/stitch/README.md`.
- Map each Stitch screen to its target React route.

## Important Rules

- `code.html` files are reference files only.
- `screen.png` files are visual references.
- `DESIGN.md` is the main design system reference.
- Do not copy Stitch HTML directly into React production files.
- Convert Stitch screens into reusable React + Vite + Tailwind components.

## Suggested Screen Mapping

| Stitch Folder | Target Route | React Page |
|---|---|---|
| `customer_login_pharmacare` | `/customer/login` | `CustomerLoginPage.jsx` |
| `customer_dashboard_pharmacare` | `/customer/dashboard` | `CustomerDashboardPage.jsx` |
| `browse_healthcare_products_pharmacare` | `/customer/products` | `ProductListPage.jsx` |
| `product_details_pharmacare` | `/customer/products/:id` | `ProductDetailPage.jsx` |
| `your_shopping_cart_pharmacare` | `/customer/cart` | `CartPage.jsx` |
| `checkout_pharmacare` | `/customer/checkout` | `CheckoutPage.jsx` |
| `your_orders_pharmacare` | `/customer/orders` | `OrdersPage.jsx` |
| `ai_health_consultant_pharmacare_1` | `/customer/chatbot` | `ChatbotPage.jsx` |
| `staff_portal_login_pharmacare` | `/staff/login` | `StaffLoginPage.jsx` |
| `admin_dashboard_pharmacare_staff` | `/staff/dashboard` | `StaffDashboardPage.jsx` |
| `inventory_management_pharmacare_staff` | `/staff/products` | `StaffProductsPage.jsx` |
| `order_fulfillment_pharmacare_staff` | `/staff/orders` | `StaffOrdersPage.jsx` |
| `shipping_logistics_pharmacare_staff` | `/staff/shipping` | `StaffShippingPage.jsx` |
| `customer_crm_pharmacare_staff` | `/staff/customers` | `StaffCustomersPage.jsx` |

## Success Criteria

- Stitch export files are stored under `docs/stitch/`.
- `docs/stitch/DESIGN.md` exists.
- `docs/stitch/README.md` explains the route mapping.
- Codex can understand which Stitch screen corresponds to which frontend page.

---

# Phase 1 — Frontend Skeleton

## Goal

Create React + Vite frontend structure and routing.

## Tasks

- Create React + Vite app in `frontend/`.
- Install and configure Tailwind CSS.
- Install React Router.
- Install Axios or prepare Fetch API.
- Create route structure.
- Create placeholder pages.
- Create basic layout folders.

## Required Frontend Structure

- `frontend/src/api/`
- `frontend/src/components/common/`
- `frontend/src/components/customer/`
- `frontend/src/components/staff/`
- `frontend/src/pages/customer/`
- `frontend/src/pages/staff/`
- `frontend/src/routes/`
- `frontend/src/styles/`

## Required Customer Routes

- `/customer/login`
- `/customer/register`
- `/customer/dashboard`
- `/customer/products`
- `/customer/products/:id`
- `/customer/cart`
- `/customer/checkout`
- `/customer/orders`
- `/customer/chatbot`

## Required Staff Routes

- `/staff/login`
- `/staff/dashboard`
- `/staff/products`
- `/staff/orders`
- `/staff/shipping`
- `/staff/customers`

## Success Criteria

- Frontend starts successfully.
- All routes render placeholder pages.
- Tailwind works.
- No backend API connection yet.

---

# Phase 2 — Customer Mock UI from Stitch

## Goal

Convert customer-facing Stitch designs into React + Vite + Tailwind mock UI.

## Input References

Use:

- `docs/stitch/DESIGN.md`
- `docs/stitch/README.md`
- `docs/stitch/raw_export/`

## Customer Pages

- `CustomerLoginPage.jsx`
- `CustomerRegisterPage.jsx`
- `CustomerDashboardPage.jsx`
- `ProductListPage.jsx`
- `ProductDetailPage.jsx`
- `CartPage.jsx`
- `CheckoutPage.jsx`
- `OrdersPage.jsx`
- `ChatbotPage.jsx`

## Customer Components

- `AppHeader`
- `CustomerSidebar`
- `ProductCard`
- `CartItemRow`
- `StatusBadge`
- `ChatMessageBubble`
- `RecommendedProductCard`
- `EmptyState`

## Rules

- Use mock data only.
- Do not connect backend APIs yet.
- Do not copy `code.html` directly.
- Preserve Stitch design language.
- Include chatbot safety disclaimer.
- Do not include real medical diagnosis text.

## Success Criteria

- Customer UI pages look close to Stitch designs.
- Customer routes are usable.
- Mock product/cart/order/chatbot data appears correctly.

---

# Phase 3 — Staff Mock UI from Stitch

## Goal

Convert staff-facing Stitch designs into React + Vite + Tailwind mock UI.

## Staff Pages

- `StaffLoginPage.jsx`
- `StaffDashboardPage.jsx`
- `StaffProductsPage.jsx`
- `StaffOrdersPage.jsx`
- `StaffShippingPage.jsx`
- `StaffCustomersPage.jsx`

## Staff Components

- `StaffSidebar`
- `DashboardMetricCard`
- `ProductTable`
- `OrderTable`
- `ShippingTable`
- `CustomerTable`
- `StatusBadge`
- `ModalForm`

## Rules

- Use mock data only.
- Do not connect backend APIs yet.
- Do not copy `code.html` directly.
- Preserve Stitch design language.
- Staff UI should look like a professional admin dashboard.

## Success Criteria

- Staff UI pages look close to Stitch designs.
- Staff routes are usable.
- Mock product/order/shipping/customer data appears correctly.

---

# Phase 4 — Backend Service Skeletons

## Goal

Create Django/DRF skeletons for all backend services.

## Services

- `api_gateway`
- `user_service`
- `product_service`
- `order_service`
- `payment_service`
- `shipping_service`
- `chatbot_service`

## Tasks

For each service:

- Create Django project.
- Install Django REST Framework.
- Add `/health/` endpoint.
- Add basic URL routing.
- Add `.env.example`.
- Add `requirements.txt`.
- Add minimal README for the service.

## Required Health Response

```json
{
  "service": "product_service",
  "status": "ok"
}
```

## Success Criteria

- Each service can run independently.
- Each service responds to `/health/`.
- Service names are consistent.
- No business logic is implemented yet.

---

# Phase 5 — Docker Compose

## Goal

Run all backend services through Docker Compose.

## Tasks

- Add root `docker-compose.yml`.
- Add Dockerfile for each backend service.
- Configure service ports.
- Configure environment variables.
- Add simple startup commands.
- Make services discoverable by container name.

## Suggested Ports

- `api_gateway` → `8000`
- `user_service` → `8001`
- `product_service` → `8002`
- `order_service` → `8003`
- `payment_service` → `8004`
- `shipping_service` → `8005`
- `chatbot_service` → `8006`
- `frontend` → `5173`

## Success Criteria

Running this command starts all backend services:

```bash
docker compose up --build
```

The following endpoints work:

- `http://localhost:8000/health/`
- `http://localhost:8001/health/`
- `http://localhost:8002/health/`
- `http://localhost:8003/health/`
- `http://localhost:8004/health/`
- `http://localhost:8005/health/`
- `http://localhost:8006/health/`

---

# Phase 6 — API Gateway

## Goal

Implement a dedicated `api_gateway` service.

## Responsibilities

The API Gateway must:

- Be a real service.
- Receive frontend requests.
- Forward requests to internal services.
- Hide internal service URLs from the frontend.
- Forward Authorization headers.
- Provide basic request logging.
- Handle CORS if needed.

## Gateway Routes

- `/api/auth/*` → `user_service`
- `/api/users/*` → `user_service`
- `/api/categories/*` → `product_service`
- `/api/products/*` → `product_service`
- `/api/cart/*` → `order_service`
- `/api/orders/*` → `order_service`
- `/api/payments/*` → `payment_service`
- `/api/shipments/*` → `shipping_service`
- `/api/chat/*` → `chatbot_service`

## Success Criteria

- Frontend can use only API Gateway URLs.
- Gateway forwards requests correctly.
- Internal service URLs are not used in frontend code.
- Gateway forwards auth headers.

---

# Phase 7 — User Service: Auth and Roles

## Goal

Implement authentication and role-based access control.

## Models

Suggested models:

- `User`
- `CustomerProfile`
- `StaffProfile`

User fields:

- `id`
- `email`
- `username`
- `password`
- `role`
- `is_active`
- `is_staff`
- `date_joined`

Allowed roles:

- `customer`
- `staff`
- `admin`

## Required APIs

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/token/refresh/`
- `GET /api/auth/me/`

## Demo Accounts

Customer:

- Email: `customer@example.com`
- Password: `Password123!`

Staff:

- Email: `staff@example.com`
- Password: `Password123!`

Admin:

- Email: `admin@example.com`
- Password: `Password123!`

## Rules

- Customer can register.
- Staff should be seeded or created by admin/staff.
- Customer login and staff login may use the same backend API.
- Backend must reject wrong role access.
- Frontend must have separate login pages.

## Success Criteria

- Customer can register and login.
- Staff can login.
- `/api/auth/me/` returns user role.
- Customer cannot access staff-only endpoints.
- Staff can access staff endpoints.

---

# Phase 8 — Product Service: Healthcare Catalog

## Goal

Implement product catalog with 10 healthcare categories and 100 products.

## Models

- `Category`
- `Product`

## Category Fields

- `id`
- `name`
- `slug`
- `description`
- `image_url`
- `sort_order`
- `is_active`
- `created_at`
- `updated_at`

## Product Fields

- `id`
- `category`
- `name`
- `slug`
- `brand`
- `description`
- `price`
- `stock`
- `image_url`
- `is_active`
- `created_at`
- `updated_at`

## Categories

Create these 10 categories:

1. OTC Medicine
2. Digestive Health
3. Vitamins & Minerals
4. Mother & Baby
5. Personal Care
6. Medical Devices
7. First Aid
8. Skincare
9. Oral Care
10. Nutrition & Health Food

## Required APIs

- `GET /api/categories/`
- `GET /api/categories/:id/`
- `GET /api/products/`
- `GET /api/products/:id/`
- `POST /api/products/`
- `PUT /api/products/:id/`
- `PATCH /api/products/:id/`
- `DELETE /api/products/:id/`

## Search/Filter

Support:

- Search by name
- Filter by category
- Filter by brand
- Filter by price range
- Filter by active status
- Sort by price
- Sort by name

## Staff Protection

Product write operations must be staff-only:

- `POST`
- `PUT`
- `PATCH`
- `DELETE`

Customer/public users can only read active products.

## Seed Data

Add a seed command:

```bash
python manage.py seed_products
```

The command must create:

- 10 categories
- 100 products

## Success Criteria

- Product service exposes category/product APIs.
- 10 categories are created.
- 100 products are created.
- Product listing supports search/filter.
- Staff can manage products.
- Customer can view products only.

---

# Phase 9 — Order Service: Cart and Checkout

## Goal

Implement cart, checkout, and order history.

For MVP, cart is implemented inside `order_service` as part of Commerce Context.

## Models

- `CartItem`
- `Order`
- `OrderItem`

## CartItem Fields

- `id`
- `user_id`
- `product_id`
- `product_name`
- `product_brand`
- `product_category`
- `product_image_url`
- `unit_price`
- `quantity`
- `created_at`
- `updated_at`

## Order Fields

- `id`
- `user_id`
- `status`
- `total_amount`
- `payment_id`
- `payment_status`
- `shipment_id`
- `shipping_status`
- `shipping_address`
- `created_at`
- `updated_at`

## OrderItem Fields

- `id`
- `order`
- `product_id`
- `product_name`
- `product_brand`
- `product_category`
- `product_image_url`
- `unit_price`
- `quantity`
- `line_total`
- `created_at`
- `updated_at`

## Required APIs

- `GET /api/cart/`
- `POST /api/cart/items/`
- `PATCH /api/cart/items/:id/`
- `DELETE /api/cart/items/:id/`
- `DELETE /api/cart/clear/`
- `GET /api/orders/`
- `GET /api/orders/:id/`
- `POST /api/orders/checkout/`

## Product Snapshot Rule

Order items must not rely on live product data after checkout.

Store snapshots:

- `product_name`
- `product_brand`
- `product_category`
- `product_image_url`
- `unit_price`
- `quantity`

## Success Criteria

- Customer can add item to cart.
- Customer can update item quantity.
- Customer can remove item from cart.
- Customer can checkout.
- Checkout creates order and order items.
- Cart is cleared after successful checkout.
- Customer can view own order history.
- Staff can view all orders.

---

# Phase 10 — Payment Service

## Goal

Implement simulated payment lifecycle.

## Model

- `Payment`

## Payment Fields

- `id`
- `order_id`
- `user_id`
- `amount`
- `status`
- `paid_at`
- `created_at`
- `updated_at`

## Allowed Statuses

- `pending`
- `paid`
- `failed`
- `cancelled`

## Required APIs

- `POST /api/payments/`
- `GET /api/payments/:id/`
- `POST /api/payments/:id/confirm/`
- `POST /api/payments/:id/cancel/`

## Rules

- New payment starts as `pending`.
- Pending payment can become `paid`.
- Pending payment can become `cancelled`.
- Paid payment should not be cancelled in MVP.
- Cancelled payment should not be confirmed.

## Success Criteria

- Order service can create payment.
- Customer/staff can view payment status where appropriate.
- Payment can be confirmed.
- Payment can be cancelled.
- Invalid transitions are rejected.

---

# Phase 11 — Shipping Service

## Goal

Implement shipment lifecycle and staff-managed shipping updates.

## Model

- `Shipment`

## Shipment Fields

- `id`
- `order_id`
- `user_id`
- `recipient_name`
- `phone`
- `address`
- `status`
- `created_at`
- `updated_at`

## Allowed Statuses

- `pending`
- `preparing`
- `shipped`
- `delivered`
- `cancelled`

## Required APIs

- `POST /api/shipments/`
- `GET /api/shipments/:id/`
- `PATCH /api/shipments/:id/status/`

## Rules

Valid transitions:

- `pending -> preparing`
- `pending -> cancelled`
- `preparing -> shipped`
- `preparing -> cancelled`
- `shipped -> delivered`
- `delivered -> terminal`
- `cancelled -> terminal`

## Success Criteria

- Order service can create shipment.
- Staff can update shipping status.
- Customer can view shipping status for own order.
- Invalid status transitions are rejected.

---

# Phase 12 — Checkout Integration

## Goal

Connect checkout with payment and shipping services.

## Checkout Behavior

During checkout:

1. Validate user cart.
2. Create order.
3. Create order items from cart items.
4. Store product snapshots.
5. Call payment service to create pending payment.
6. Call shipping service to create pending shipment.
7. Update order with payment/shipping IDs and statuses.
8. Clear cart.
9. Return order confirmation.

## Failure Handling

- If payment creation fails, return clear error.
- If shipment creation fails after payment creation, attempt to cancel payment.
- Do not directly access payment or shipping databases.

## Success Criteria

- Checkout creates order.
- Checkout creates payment.
- Checkout creates shipment.
- Order stores payment/shipping snapshots.
- Cart is cleared after successful checkout.
- Failure behavior is documented.

---

# Phase 13 — Connect Customer Frontend to API Gateway

## Goal

Replace customer mock data with real APIs through `api_gateway`.

## Tasks

- Create `frontend/src/api/apiClient.js`.
- Use `VITE_API_BASE_URL=http://localhost:8000`.
- Create API modules:
  - `authApi.js`
  - `productApi.js`
  - `cartApi.js`
  - `orderApi.js`
  - `chatApi.js`
- Store JWT access token in localStorage.
- Send Authorization header through API client.
- Connect customer login.
- Connect product listing.
- Connect product detail.
- Connect cart.
- Connect checkout.
- Connect orders.

## Rule

Frontend must not call internal service ports directly.

## Success Criteria

- Customer can login.
- Customer can view products from backend.
- Customer can add to cart.
- Customer can checkout.
- Customer can view orders.
- UI design remains consistent with Stitch.

---

# Phase 14 — Connect Staff Frontend to API Gateway

## Goal

Connect staff UI to backend APIs through `api_gateway`.

## Tasks

- Connect staff login.
- Add role-based route protection.
- Connect staff product management.
- Connect staff orders.
- Connect staff shipping management.
- Connect customer list if API exists.

## Rule

Customer token must not access staff pages.

## Success Criteria

- Staff can login.
- Staff can access staff dashboard.
- Staff can manage products.
- Staff can view orders.
- Staff can update shipping status.
- Customer cannot access staff UI.

---

# Phase 15 — Chatbot Dataset Generation

## Goal

Create self-seeded datasets for chatbot training.

The chatbot should not rely only on hard-coded rules. It must use model artifacts trained from self-seeded data.

## Required Dataset Files

Create:

- `ml/datasets/products_seed.csv`
- `ml/datasets/chatbot_intents_seed.csv`
- `ml/datasets/chatbot_training_seed.csv`
- `ml/datasets/recommendation_training_seed.csv`

## Dataset Source

The dataset should be generated from:

- The 10 product categories
- The 100 seeded products
- Predefined user consultation scenarios
- Common pharmacy e-commerce questions
- Order/payment/shipping questions
- Safety warning scenarios

Do not use real patient data.

Do not use sensitive health data.

Do not claim clinical validity.

## Required Intent Labels

The dataset should include at least these intents:

- `product_search`
- `category_recommendation`
- `digestive_support`
- `vitamin_advice`
- `skincare_support`
- `oral_care_support`
- `baby_care_support`
- `first_aid_support`
- `medical_device_question`
- `order_status_question`
- `shipping_question`
- `payment_question`
- `greeting`
- `fallback`
- `medical_warning`

## Required Category Labels

The dataset should include these target categories:

- `OTC Medicine`
- `Digestive Health`
- `Vitamins & Minerals`
- `Mother & Baby`
- `Personal Care`
- `Medical Devices`
- `First Aid`
- `Skincare`
- `Oral Care`
- `Nutrition & Health Food`

## Dataset Format

`chatbot_training_seed.csv` should include:

- `text`
- `intent`
- `target_category`
- `safe_response_template`
- `requires_medical_disclaimer`

## Dataset Size Target

Minimum target:

- At least 500 chatbot training examples
- At least 30 examples per major intent where possible
- At least 20 examples per product category where possible

Better target:

- 1,000 to 2,000 chatbot training examples
- Balanced intent distribution
- Multiple paraphrases per scenario

## Success Criteria

- Dataset generation script exists.
- Generated CSV files exist.
- Dataset includes all required intents.
- Dataset includes all required product categories.
- Dataset is safe and does not contain real patient data.
- Dataset can be uploaded to Kaggle for training.

---

# Phase 16 — Kaggle Chatbot Training Notebook

## Goal

Create a Kaggle-ready notebook to train chatbot models using the self-seeded datasets.

## Required Notebook

Create:

- `ml/notebooks/kaggle_train_chatbot.ipynb`

## Required Training Tasks

The notebook must train:

1. Intent classifier
2. Category recommender

Minimum acceptable model:

- TF-IDF vectorizer
- Logistic Regression or Linear SVM for intent classification
- TF-IDF vectorizer
- Logistic Regression or Linear SVM for category classification

Optional advanced model:

- LSTM
- GRU
- Simple Transformer-based classifier
- Sentence embedding classifier

The simple baseline must be completed first.

## Required Notebook Sections

The notebook should include:

1. Project introduction
2. Dataset loading
3. Dataset inspection
4. Label distribution
5. Train/test split
6. Text preprocessing
7. Intent model training
8. Category model training
9. Evaluation
10. Confusion matrix
11. Example predictions
12. Artifact export
13. Notes for integration into Django chatbot service

## Required Metrics

Save metrics for:

- Intent accuracy
- Intent precision
- Intent recall
- Intent F1-score
- Category accuracy
- Category precision
- Category recall
- Category F1-score

## Required Exported Artifacts

The notebook must export:

- `intent_model.pkl`
- `intent_vectorizer.pkl`
- `category_model.pkl`
- `category_vectorizer.pkl`
- `label_encoders.pkl`
- `model_metadata.json`
- `metrics.json`

Save these files into:

- `ml/artifacts/`

After training on Kaggle, these artifacts should be downloaded and copied into:

- `services/chatbot_service/artifacts/`

## Success Criteria

- Kaggle notebook runs successfully.
- The notebook trains an intent model.
- The notebook trains a category model.
- The notebook reports metrics.
- The notebook exports model artifacts.
- The artifacts can be used by `chatbot_service`.

---

# Phase 17 — Chatbot Service Integration

## Goal

Integrate trained model artifacts into `chatbot_service`.

## Required Artifact Location

The chatbot service should load model artifacts from:

- `services/chatbot_service/artifacts/`

Expected files:

- `intent_model.pkl`
- `intent_vectorizer.pkl`
- `category_model.pkl`
- `category_vectorizer.pkl`
- `label_encoders.pkl`
- `model_metadata.json`
- `metrics.json`

## Required API

- `POST /api/chat/`
- `POST /api/chat/recommend/`

## Required Behavior

The chatbot should:

1. Receive user message.
2. Transform text using vectorizer.
3. Predict intent.
4. Predict target category if appropriate.
5. Retrieve relevant products from product data or product API.
6. Generate safe response.
7. Add disclaimer when needed.
8. Return structured response.

## Fallback Behavior

If model artifacts are missing or fail to load:

- Return a safe rule-based fallback response.
- Log the model loading error.
- Do not crash the service.

## Safety Rules

The chatbot must not:

- Diagnose diseases
- Claim that a product cures a disease
- Replace doctor/pharmacist advice
- Recommend prescription treatment
- Give unsafe emergency guidance

The chatbot must redirect severe symptoms to professional help.

## Success Criteria

- Chatbot loads trained artifacts successfully.
- Chatbot predicts intent.
- Chatbot predicts category.
- Chatbot returns safe response.
- Chatbot can suggest relevant product categories.
- Chatbot does not diagnose disease.
- Chatbot has fallback behavior.

---

# Phase 18 — End-to-End Testing and Documentation

## Goal

Make sure the complete system flow works and document how to run the project.

## Main Demo Flow

1. Customer registers.
2. Customer logs in.
3. Customer browses products.
4. Customer searches or filters products.
5. Customer adds products to cart.
6. Customer checks out.
7. Order is created.
8. Payment is created as pending.
9. Shipment is created as pending.
10. Customer confirms payment or staff simulates confirmation.
11. Staff updates shipping status.
12. Customer views updated order status.
13. Customer asks chatbot for product consultation.
14. Chatbot predicts intent/category using trained model artifacts.
15. Chatbot returns safe product recommendation.

## Documentation Tasks

Update root README with:

- Project overview
- Architecture
- Service list
- Tech stack
- How to run
- Demo accounts
- Main workflows
- API Gateway routes
- Database-per-service explanation
- Stitch UI reference explanation
- Chatbot training explanation
- Kaggle notebook explanation
- Known limitations

Update ML README with:

- Dataset generation process
- Dataset columns
- Intent labels
- Category labels
- How to run Kaggle notebook
- How to export artifacts
- How to copy artifacts into `chatbot_service`

## Success Criteria

- Full customer flow works.
- Full staff flow works.
- Chatbot works with trained artifacts or safe fallback.
- README is clear.
- Known limitations are documented.

---

# Final MVP Completion Checklist

## UI and Design

- [ ] Google Stitch exports are stored under `docs/stitch/`.
- [ ] `docs/stitch/DESIGN.md` exists.
- [ ] `docs/stitch/README.md` exists.
- [ ] React + Vite frontend exists.
- [ ] Customer mock UI is implemented.
- [ ] Staff mock UI is implemented.
- [ ] UI follows Stitch design language.
- [ ] Stitch `code.html` is not copied directly as production code.

## Architecture

- [ ] Dedicated `api_gateway` service exists.
- [ ] All backend services are separate Django projects.
- [ ] Frontend calls API Gateway only.
- [ ] Services have clear ownership.
- [ ] No cross-service database access.
- [ ] Docker Compose runs the system.

## Auth

- [ ] Customer registration works.
- [ ] Customer login works.
- [ ] Staff login works.
- [ ] Customer/staff pages are separated.
- [ ] Backend validates role permissions.

## Product

- [ ] 10 healthcare categories exist.
- [ ] 100 products exist.
- [ ] Product listing works.
- [ ] Product search/filter works.
- [ ] Staff product management works.

## Cart and Order

- [ ] Customer can add item to cart.
- [ ] Customer can update quantity.
- [ ] Customer can remove item.
- [ ] Customer can checkout.
- [ ] Order items store product snapshots.
- [ ] Customer can view own orders.
- [ ] Staff can view all orders.

## Payment

- [ ] Payment is created during checkout.
- [ ] Payment status starts as pending.
- [ ] Payment can be confirmed.
- [ ] Payment can be cancelled.
- [ ] Invalid payment transitions are rejected.

## Shipping

- [ ] Shipment is created during checkout.
- [ ] Shipment status starts as pending.
- [ ] Staff can update shipping status.
- [ ] Invalid shipping transitions are rejected.
- [ ] Customer can view shipping status.

## Chatbot Dataset and Training

- [ ] Self-seeded chatbot dataset exists.
- [ ] Dataset includes required intent labels.
- [ ] Dataset includes required category labels.
- [ ] Kaggle training notebook exists.
- [ ] Intent model is trained.
- [ ] Category model is trained.
- [ ] Metrics are exported.
- [ ] Model artifacts are exported.
- [ ] Artifacts are copied into `chatbot_service`.

## Chatbot Service

- [ ] Chatbot endpoint works.
- [ ] Chatbot loads trained model artifacts.
- [ ] Chatbot predicts intent.
- [ ] Chatbot predicts category.
- [ ] Customer chatbot UI works.
- [ ] Chatbot suggests safe product categories.
- [ ] Chatbot does not diagnose disease.
- [ ] Chatbot includes safety disclaimer when needed.
- [ ] Chatbot has fallback response.

## Frontend API Integration

- [ ] Customer login page calls API Gateway.
- [ ] Staff login page calls API Gateway.
- [ ] Product page uses backend products.
- [ ] Cart page uses backend cart.
- [ ] Checkout page calls backend checkout.
- [ ] Orders page uses backend orders.
- [ ] Chatbot page calls backend chatbot service.
- [ ] Staff product/order/shipping pages call API Gateway.

## Documentation

- [ ] Root README exists.
- [ ] Service READMEs exist.
- [ ] ML README exists.
- [ ] Demo accounts are documented.
- [ ] Run commands are documented.
- [ ] Main workflows are documented.
- [ ] Stitch UI reference usage is documented.
- [ ] Kaggle training process is documented.
- [ ] Known limitations are documented.

---

# Recommended Implementation Order

Use this order when asking the coding agent to work:

1. Organize Google Stitch exports under `docs/stitch/`
2. Create React + Vite frontend skeleton
3. Convert customer Stitch screens into mock React UI
4. Convert staff Stitch screens into mock React UI
5. Create backend Django service skeletons
6. Add Docker Compose
7. Implement API Gateway health and routing
8. Implement `user_service` auth and roles
9. Implement `product_service` models, APIs, seed data
10. Implement `order_service` cart and checkout
11. Implement `payment_service`
12. Implement `shipping_service`
13. Connect checkout to payment and shipping
14. Connect customer frontend to API Gateway
15. Connect staff frontend to API Gateway
16. Create chatbot dataset generation scripts
17. Create Kaggle chatbot training notebook
18. Train/export chatbot model artifacts
19. Integrate artifacts into `chatbot_service`
20. Test end-to-end flow
21. Clean README and documentation

Do not ask the coding agent to build the entire system in one step. Work phase by phase.