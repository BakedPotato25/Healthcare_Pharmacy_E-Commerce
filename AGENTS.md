# AGENTS.md

## Project Goal

Build a **Healthcare Pharmacy E-Commerce Microservices System** for a Software Architecture and Design essay/demo.

The system is inspired by an online pharmacy e-commerce website. It allows customers to browse healthcare/pharmacy products, manage cart, checkout, make simulated payments, track shipping, and use a safe AI chatbot/product consultation assistant.

This is an academic microservices project. The goal is not to build a production medical system, but to demonstrate:

- Domain-Driven Design decomposition
- Microservices architecture
- Database-per-service principle
- Dedicated API Gateway service
- Customer/staff role separation
- Healthcare/pharmacy product catalog
- End-to-end order/payment/shipping workflow
- Safe AI product consultation and recommendation
- AI model training using self-seeded data on Kaggle
- Integration between trained model artifacts and the chatbot service
- UI implementation based on Google Stitch design references

---

## Core System Direction

The project domain is:

**Healthcare Pharmacy E-Commerce**

Do not build a full hospital management system.

The project should focus on:

- Customer account
- Staff account
- Healthcare/pharmacy product catalog
- Cart
- Order
- Payment
- Shipping
- Product consultation chatbot
- Recommendation based on self-seeded training data

Do not over-expand into:

- Full doctor scheduling system
- Full patient medical record system
- Prescription validation system
- Real insurance claim processing
- Real medical diagnosis
- Real pharmacy compliance workflow

These can be mentioned later in the essay as future work, but they should not be built in the MVP unless explicitly requested.

---

## Required Technology Stack

### Backend

Use:

- Python
- Django
- Django REST Framework
- JWT authentication where needed
- One Django project per backend service

Required backend services:

- `api_gateway`
- `user_service`
- `product_service`
- `order_service`
- `payment_service`
- `shipping_service`
- `chatbot_service`

The backend folder structure must be:

- `services/api_gateway/`
- `services/user_service/`
- `services/product_service/`
- `services/order_service/`
- `services/payment_service/`
- `services/shipping_service/`
- `services/chatbot_service/`

The project must have a dedicated `api_gateway` service.

Do not replace it with frontend-only routing.

The frontend must call the API Gateway, and the API Gateway forwards requests to internal services.

---

### Frontend

Use:

- React
- Vite
- Tailwind CSS
- React Router
- Axios or Fetch API
- lucide-react for icons if needed

Do not use Next.js unless explicitly requested later.

For this project, React + Vite is preferred because:

- It is simpler.
- It is easier to integrate with Google Stitch UI.
- It avoids unnecessary SSR complexity.
- It is enough for an academic architecture demo.

---

### Machine Learning

Use:

- Python
- pandas
- scikit-learn
- joblib or pickle
- Kaggle notebook for training

Minimum chatbot model:

- TF-IDF vectorizer
- Logistic Regression or Linear SVM intent classifier
- TF-IDF vectorizer
- Logistic Regression or Linear SVM category classifier

Optional advanced model after MVP:

- LSTM
- GRU
- Simple Transformer-based classifier
- Sentence embedding classifier

The simple baseline must be implemented first because it is easier to train, explain, export, and integrate into Django.

---

## Required Root Folder Structure

The expected root folder structure is:

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

## Google Stitch UI Reference Rules

Google Stitch exports are stored under:

- `docs/stitch/`
- `docs/stitch/DESIGN.md`
- `docs/stitch/raw_export/`

Each Stitch screen may include:

- `screen.png`
- `code.html`

These files are UI references only.

Do not copy `code.html` directly into production React files as standalone HTML.

When implementing the frontend:

1. Read `docs/stitch/DESIGN.md` first.
2. Read `docs/stitch/README.md`.
3. Use `screen.png` as visual reference.
4. Use `code.html` only as layout/style reference.
5. Convert the design into React + Vite + Tailwind components.
6. Keep reusable components under `frontend/src/components/`.
7. Keep pages under `frontend/src/pages/`.
8. Use mock data first.
9. Connect backend APIs only after the UI routes and mock pages work.

The frontend design should stay consistent with the Stitch design system.

Do not randomly redesign the UI unless explicitly requested.

---

## Frontend Structure Rules

The frontend should follow this structure:

- `frontend/src/api/`
- `frontend/src/components/common/`
- `frontend/src/components/customer/`
- `frontend/src/components/staff/`
- `frontend/src/pages/customer/`
- `frontend/src/pages/staff/`
- `frontend/src/routes/`
- `frontend/src/styles/`
- `frontend/src/App.jsx`
- `frontend/src/main.jsx`
- `frontend/src/index.css`

Recommended frontend files:

- `frontend/src/api/apiClient.js`
- `frontend/src/api/authApi.js`
- `frontend/src/api/productApi.js`
- `frontend/src/api/cartApi.js`
- `frontend/src/api/orderApi.js`
- `frontend/src/api/chatApi.js`
- `frontend/src/routes/AppRoutes.jsx`
- `frontend/src/routes/ProtectedRoute.jsx`

The frontend must call backend APIs through:

- `VITE_API_BASE_URL=http://localhost:8000`

Do not call internal service ports directly from frontend components.

---

## Product Catalog Rule

The product catalog should contain:

**10 healthcare categories × 10 products per category = 100 products**

Suggested categories:

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

Product fields should include at least:

- `id`
- `name`
- `slug`
- `category`
- `brand`
- `description`
- `price`
- `stock`
- `image_url`
- `is_active`
- `created_at`
- `updated_at`

Avoid real prescription medicine workflows.

If prescription-related products are added later, they must be staff-managed and must not imply real-world medical safety, legal pharmacy approval, or prescription validation.

---

## User Roles

The system has three possible roles:

- `customer`
- `staff`
- `admin`

### Customer

Customer can:

- Register
- Login through customer login page
- Browse products
- Search/filter products
- View product detail
- Add products to cart
- Update cart quantity
- Remove cart items
- Checkout
- View own orders
- Use chatbot/product consultation

### Staff

Staff can:

- Login through staff login page
- View staff dashboard
- Manage products
- View customers
- View orders
- Update order/shipping status

### Admin

Admin can:

- Use Django admin
- Manage system data
- Manage users where needed

---

## Frontend Route Rules

The UI must have separate login pages:

- `/customer/login`
- `/staff/login`

Customer routes:

- `/customer/register`
- `/customer/dashboard`
- `/customer/products`
- `/customer/products/:id`
- `/customer/cart`
- `/customer/checkout`
- `/customer/orders`
- `/customer/chatbot`

Staff routes:

- `/staff/dashboard`
- `/staff/products`
- `/staff/orders`
- `/staff/shipping`
- `/staff/customers`

The backend auth API can be shared, but the UI must clearly separate customer and staff login flows.

A customer must not be able to access staff pages.

A staff user must not be redirected to the customer dashboard by default.

---

## Service Ownership Rules

### `api_gateway`

Responsibilities:

- Public API entry point
- Route frontend requests to internal services
- Hide internal service URLs from the frontend
- Add basic request logging
- Forward auth headers
- Handle CORS if needed
- Provide health check aggregation if possible

The frontend should call API routes through the API Gateway only.

Do not let the frontend call internal service URLs directly.

---

### `user_service`

Responsibilities:

- User registration
- Customer login
- Staff login
- JWT issuing/validation
- User profile
- Role-based access control
- Staff/customer distinction

Owns:

- `User`
- `CustomerProfile`
- `StaffProfile`

---

### `product_service`

Responsibilities:

- Product category management
- Product management
- Product listing
- Product detail
- Search/filter/sort
- Seed 10 categories × 10 products

Owns:

- `Category`
- `Product`

---

### `order_service`

Responsibilities:

- Cart
- Cart item
- Checkout
- Order
- Order item
- Order snapshots
- Customer order history

Owns:

- `CartItem`
- `Order`
- `OrderItem`

Order service must store product snapshots such as:

- `product_id`
- `product_name`
- `product_brand`
- `product_category`
- `product_image_url`
- `unit_price`
- `quantity`

This is required so that old orders remain stable even if product data changes later.

---

### `payment_service`

Responsibilities:

- Simulated payment creation
- Payment confirmation
- Payment cancellation
- Payment status tracking

Owns:

- `Payment`

Allowed payment statuses:

- `pending`
- `paid`
- `failed`
- `cancelled`

---

### `shipping_service`

Responsibilities:

- Shipment creation
- Shipment status update
- Delivery tracking
- Staff-managed shipping status

Owns:

- `Shipment`

Allowed shipping statuses:

- `pending`
- `preparing`
- `shipped`
- `delivered`
- `cancelled`

---

### `chatbot_service`

Responsibilities:

- Safe product consultation
- Product recommendation
- Intent prediction
- Category recommendation
- FAQ-style response
- Behavior-based suggestion if available
- Loading trained model artifacts
- Fallback response when the trained model is unavailable

The chatbot must use trained model artifacts generated from self-seeded training data.

The chatbot must not be only rule-based in the final implementation.

The final chatbot should have:

- Intent classifier
- Category recommender
- Safe response generator
- Optional FAQ/RAG context retriever
- Fallback rule-based response

---

## Chatbot Training Requirement

The chatbot must be trained using self-seeded data.

The training process should be designed so it can be run on Kaggle.

The repository should include:

- Dataset generation script
- Generated CSV datasets
- Kaggle notebook
- Training script or notebook cells
- Exported model artifacts
- Metrics report
- Instructions for importing artifacts into `chatbot_service`

Required ML folder structure:

- `ml/datasets/`
- `ml/notebooks/`
- `ml/artifacts/`
- `ml/reports/`

Required dataset files:

- `ml/datasets/products_seed.csv`
- `ml/datasets/chatbot_intents_seed.csv`
- `ml/datasets/chatbot_training_seed.csv`
- `ml/datasets/recommendation_training_seed.csv`

Required Kaggle notebook:

- `ml/notebooks/kaggle_train_chatbot.ipynb`

Required model artifacts after training:

- `ml/artifacts/intent_model.pkl`
- `ml/artifacts/intent_vectorizer.pkl`
- `ml/artifacts/category_model.pkl`
- `ml/artifacts/category_vectorizer.pkl`
- `ml/artifacts/label_encoders.pkl`
- `ml/artifacts/model_metadata.json`
- `ml/artifacts/metrics.json`

The artifacts should be copied or mounted into:

- `services/chatbot_service/artifacts/`

The chatbot service must load artifacts from:

- `services/chatbot_service/artifacts/`

---

## Chatbot Dataset Rules

The chatbot dataset should be generated from the product catalog and predefined pharmacy consultation scenarios.

Do not use real patient data.

Do not use sensitive personal health data.

Do not claim the data is medically validated.

The data is for academic demonstration only.

### Required Intent Labels

The intent classifier should support at least these intents:

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

### Required Category Labels

The category recommender should support these categories:

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

### Dataset Format

`chatbot_training_seed.csv` should include:

- `text`
- `intent`
- `target_category`
- `safe_response_template`
- `requires_medical_disclaimer`

---

## Chatbot Safety Rules

The chatbot must not:

- Diagnose diseases
- Claim that a product cures a disease
- Replace doctor/pharmacist advice
- Recommend prescription treatment
- Give emergency medical instructions beyond advising professional help
- Pretend to be a doctor
- Give unsafe medical advice

The chatbot can:

- Suggest general product categories
- Recommend non-prescription healthcare products
- Explain product usage in general terms
- Suggest consulting a doctor or pharmacist
- Warn users to seek urgent medical attention for severe symptoms

Example safe response:

"Based on your concern, you may want to look at Digestive Health products such as probiotics or oral rehydration products. This is only a general product suggestion and does not replace advice from a doctor or pharmacist."

For severe symptoms, use a warning response:

"Your symptoms may require professional medical attention. Please contact a doctor, pharmacist, or emergency service instead of relying on product suggestions."

---

## Communication Rules

Use REST API for MVP.

Allowed communication:

- `frontend -> api_gateway -> service`
- `service -> service via HTTP API`

Do not allow:

- `frontend -> product_service directly`
- `frontend -> order_service directly`
- `order_service -> product_service database directly`
- `payment_service -> order_service database directly`

The API Gateway is required.

For MVP, synchronous REST communication is acceptable.

Later improvement can mention:

- Saga pattern
- Transactional outbox
- Message broker
- Event-driven communication

Do not implement complex event-driven architecture unless explicitly requested.

---

## Checkout Flow

The target checkout flow is:

1. Customer sends checkout request.
2. API Gateway forwards request to `order_service`.
3. `order_service` creates order and order items.
4. `order_service` calls `payment_service` to create pending payment.
5. `order_service` calls `shipping_service` to create pending shipment.
6. `order_service` stores payment/shipping snapshot/status.
7. Customer sees order confirmation.

If payment or shipping creation fails, return clear error messages.

For MVP, keep compensation simple.

Example:

- If payment is created but shipment fails, call payment cancellation if possible.
- If cancellation is not implemented yet, mark the order as failed/cancelled and document this limitation.

---

## API Design Rules

Use clear RESTful endpoints.

Suggested public gateway endpoints:

- `/api/auth/register/`
- `/api/auth/login/`
- `/api/auth/me/`
- `/api/products/`
- `/api/products/:id/`
- `/api/categories/`
- `/api/cart/`
- `/api/cart/items/`
- `/api/cart/items/:id/`
- `/api/orders/`
- `/api/orders/:id/`
- `/api/orders/checkout/`
- `/api/payments/`
- `/api/payments/:id/`
- `/api/payments/:id/confirm/`
- `/api/payments/:id/cancel/`
- `/api/shipments/`
- `/api/shipments/:id/`
- `/api/shipments/:id/status/`
- `/api/chat/`
- `/api/chat/recommend/`

Each service can expose internal endpoints, but the frontend should only use gateway routes.

---

## Code Style Rules

General:

- Write clean, readable code.
- Use English for code, class names, comments, variables, and API fields.
- Keep business logic inside services, not inside views only.
- Avoid large monolithic files.
- Keep models, serializers, views, urls, services/helpers separated.
- Add clear comments only where useful.
- Do not over-engineer.
- Prioritize a working MVP.

Django:

- Use Django REST Framework serializers.
- Use class-based views or viewsets where appropriate.
- Keep URL paths explicit.
- Use environment variables for service URLs and secrets.
- Provide seed commands where needed.
- Add health check endpoints to every service.

Frontend:

- Keep pages organized by role.
- Use reusable components.
- Keep API client functions in a separate module.
- Do not hard-code internal service URLs in components.
- Use the API Gateway base URL only.
- Implement mock UI first, then connect real APIs.
- Preserve Stitch design language.

ML:

- Keep dataset generation reproducible.
- Keep model training reproducible.
- Save metrics.
- Save model artifacts.
- Document how to train on Kaggle.
- Document how to copy artifacts into chatbot service.
- Provide local fallback training script if possible.

---

## Required Health Endpoints

Every backend service should expose:

- `/health/`

Expected response:

```json
{
  "service": "product_service",
  "status": "ok"
}
```

The API Gateway should be able to call or expose health information for all services if possible.

---

## Seed Data Rules

The product service must include a seed command or seed script.

The seed data must create:

- 10 categories
- 100 products

The user service should include seed staff/admin data for demo.

Example demo accounts:

Customer:

- Email: `customer@example.com`
- Password: `Password123!`

Staff:

- Email: `staff@example.com`
- Password: `Password123!`

Admin:

- Email: `admin@example.com`
- Password: `Password123!`

Never use these passwords for production. They are for local academic demo only.

---

## Security Rules

For MVP:

- Use JWT for API authentication.
- Protect staff endpoints.
- Protect customer order/cart endpoints.
- Do not expose admin-only functionality to customer.
- Do not rely only on frontend route protection.
- Backend must validate role permissions.

Required behavior:

- Customer cannot access staff product management.
- Customer cannot update shipping status.
- Customer can only view their own orders.
- Staff can view customer/order data for management.

---

## Report-Friendly Evidence Rules

Because the source code will be used later to write the essay, keep the implementation easy to explain.

Prefer explicit names:

- `user_service`
- `product_service`
- `order_service`
- `payment_service`
- `shipping_service`
- `chatbot_service`
- `api_gateway`

Prefer clear architectural boundaries.

Do not rename services randomly.

Do not merge all services into one Django project.

Do not remove the API Gateway.

Do not remove database-per-service structure.

Add README notes or comments when a design decision is important, especially:

- Why cart is inside `order_service`
- Why product snapshots are stored in `order_service`
- Why chatbot does not diagnose disease
- Why chatbot uses self-seeded training data
- Why Kaggle is used for model training
- Why API Gateway is used
- Why database-per-service avoids cross-service foreign keys
- Why Stitch files are design references, not production frontend code

---

## MVP First Rule

Always complete the MVP before adding optional features.

MVP features:

1. Google Stitch references organized
2. React + Vite frontend skeleton
3. Mock customer UI
4. Mock staff UI
5. Backend service skeletons
6. Docker Compose
7. API Gateway
8. Auth and roles
9. Product catalog
10. Cart
11. Checkout
12. Payment simulation
13. Shipping simulation
14. Customer UI connected to API Gateway
15. Staff UI connected to API Gateway
16. Self-seeded chatbot dataset
17. Kaggle training notebook
18. Trained chatbot model artifacts
19. Chatbot service integration
20. End-to-end verification

Optional features should only be added after MVP works:

- Kubernetes
- Prometheus/Grafana
- Advanced RAG
- Neo4j graph recommendation
- Message broker
- Saga/outbox
- Advanced search
- Product reviews
- Real payment provider
- Advanced LSTM/GRU chatbot model

---

## What Not To Do

Do not:

- Build a hospital management system instead of pharmacy e-commerce.
- Add appointment booking unless explicitly requested.
- Add doctor management unless explicitly requested.
- Add medical records unless explicitly requested.
- Add real medical diagnosis.
- Add real prescription approval workflow.
- Let frontend call internal services directly.
- Remove `api_gateway`.
- Put all business logic in the frontend.
- Put all backend logic in one service.
- Share one database across all services.
- Create cross-service database foreign keys.
- Use Next.js unless the project direction changes.
- Add complex infrastructure before MVP works.
- Make chatbot only rule-based in the final implementation.
- Use real patient data for training.
- Claim that the chatbot is clinically validated.
- Paste Stitch `code.html` directly into `frontend/src`.
- Ignore `docs/stitch/DESIGN.md`.
- Redesign the UI from scratch when Stitch references already exist.
- Connect APIs before the mock UI pages work.

---

## Agent Work Process

When implementing any task:

1. Read `AGENTS.md`.
2. Read `PLAN.md`.
3. Read `docs/stitch/README.md` when working on frontend UI.
4. Identify the current phase.
5. Implement only the requested phase/task.
6. Avoid modifying unrelated files.
7. Keep service boundaries intact.
8. Run relevant tests or provide commands to test.
9. Summarize changed files.
10. Explain how to verify the feature.

When reporting progress, use this format:

Implemented:

- ...

Changed files:

- ...

How to run:

- ...

How to verify:

- ...

Notes / limitations:

- ...

---

## Success Definition

The project is successful when:

- Google Stitch exports are organized under `docs/stitch/`.
- React frontend follows the Stitch design system.
- Docker Compose can run the system.
- Frontend can access backend through API Gateway.
- Customer can register/login.
- Staff can login.
- Product catalog has 10 categories and 100 products.
- Customer can browse products.
- Customer can add products to cart.
- Customer can checkout.
- Payment and shipping records are created.
- Staff can manage products/orders/shipping.
- Chatbot dataset is self-seeded.
- Chatbot model is trained on Kaggle or through the provided Kaggle notebook.
- Trained model artifacts are integrated into `chatbot_service`.
- Chatbot can provide safe product consultation.
- The architecture can be explained clearly in the final essay.