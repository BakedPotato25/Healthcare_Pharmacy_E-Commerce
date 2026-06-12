# Quick Start Guide

Guide nay dung de start project khi Docker image/container da build roi.

## 1. Mo Docker Desktop

Doi Docker Desktop chay xong, sau do mo PowerShell tai root project:

```powershell
cd C:\Users\nguye\Desktop\Healthcare_Pharmacy_E-Commerce
```

## 2. Start backend services

Tai root project, chay:

```powershell
docker compose up -d
```

Kiem tra container:

```powershell
docker compose ps
```

Tat ca service nen o trang thai `running` hoac `healthy`.

## 3. Kiem tra API Gateway

```powershell
curl.exe http://localhost:8000/health/
curl.exe http://localhost:8000/health/services/
```

Neu tra ve JSON hop le, backend da chay.

## 4. Start frontend

Mo terminal PowerShell thu hai:

```powershell
cd C:\Users\nguye\Desktop\Healthcare_Pharmacy_E-Commerce\frontend
npm run dev -- --host 0.0.0.0
```

Mo web:

```text
http://localhost:5173
```

## 5. Tai khoan dang nhap demo

### Customer Web

```text
URL: http://localhost:5173/customer/login
Email: customer@example.com
Password: Password123!
```

### Staff Web

```text
URL: http://localhost:5173/staff/login
Email: staff@example.com
Password: Password123!
```

### Django Admin cua User Service

```text
URL: http://localhost:8001/admin/
Email: admin@example.com
Password: Password123!
```

## 6. Chi chay khi data bi thieu

Neu login loi hoac product list rong, chay:

```powershell
docker compose exec -T user_service python manage.py seed_demo_users
docker compose exec -T product_service python manage.py seed_products
```

Neu database chua migrate, chay:

```powershell
docker compose exec -T user_service python manage.py migrate
docker compose exec -T product_service python manage.py migrate
docker compose exec -T order_service python manage.py migrate
docker compose exec -T payment_service python manage.py migrate
docker compose exec -T shipping_service python manage.py migrate
```

Sau do chay lai seed data:

```powershell
docker compose exec -T user_service python manage.py seed_demo_users
docker compose exec -T product_service python manage.py seed_products
```

