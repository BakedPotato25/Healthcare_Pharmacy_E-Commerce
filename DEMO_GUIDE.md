# Huong dan khoi tao project de demo

Guide nay dung de chay nhanh demo Healthcare Pharmacy E-Commerce Microservices tren may local.

Project la demo hoc thuat, khong phai he thong y te/nha thuoc that. Chatbot chi dua ra goi y san pham tong quat va khong thay the bac si hoac duoc si.

## 1. Yeu cau truoc khi chay

Can cai san:

- Docker Desktop
- Node.js va npm
- PowerShell

Cac port du kien:

| Thanh phan | Port | URL |
|---|---:|---|
| API Gateway | 8000 | `http://localhost:8000` |
| User Service | 8001 | `http://localhost:8001` |
| Product Service | 8002 | `http://localhost:8002` |
| Order Service | 8003 | `http://localhost:8003` |
| Payment Service | 8004 | `http://localhost:8004` |
| Shipping Service | 8005 | `http://localhost:8005` |
| Chatbot Service | 8006 | `http://localhost:8006` |
| Frontend | 5173 | `http://localhost:5173` |

Neu mot trong cac port tren dang bi ung dung khac chiem, hay tat ung dung do truoc khi demo.

## 2. Mo terminal tai root project

```powershell
cd C:\Users\nguye\Desktop\Healthcare_Pharmacy_E-Commerce
```

Kiem tra Docker dang chay:

```powershell
docker compose ps
```

Neu Docker chua chay, mo Docker Desktop truoc roi chay lai lenh tren.

## 3. Cai frontend dependencies

Lan dau tien hoac sau khi xoa `node_modules`, chay:

```powershell
cd frontend
npm install
Copy-Item .env.example .env -Force
cd ..
```

File `frontend/.env` can co:

```text
VITE_API_BASE_URL=http://localhost:8000
```

Frontend chi duoc goi API qua API Gateway tai port `8000`, khong goi truc tiep cac internal service port.

## 4. Build/chay backend services

### Truong hop A: Lan dau chay hoac can build lai

Tai root project:

```powershell
docker compose up --build -d
```

Dung cach nay khi:

- Lan dau chay project tren may local.
- Vua sua `Dockerfile`, `requirements.txt`, dependency, hoac config build.
- Vua clone project hoac muon tao lai image moi.

### Truong hop B: Da build roi

Neu image/container da build tu truoc va ban chi muon mo lai demo:

```powershell
docker compose up -d
```

Neu cac container dang chay san, chi can kiem tra trang thai:

```powershell
docker compose ps
```

Neu service bi loi sau khi sua code backend, co the rebuild rieng service do, vi du:

```powershell
docker compose up --build -d api_gateway
```

Kiem tra container:

```powershell
docker compose ps
```

Tat ca service nen o trang thai running hoac healthy.

## 5. Chay database migrations

Chay migrations cho cac service co database demo:

```powershell
docker compose exec -T user_service python manage.py migrate
docker compose exec -T product_service python manage.py migrate
docker compose exec -T order_service python manage.py migrate
docker compose exec -T payment_service python manage.py migrate
docker compose exec -T shipping_service python manage.py migrate
```

Repo hien dang dung SQLite cho demo local. Neu recreate container hoac xoa database, chay lai migrations va seed data.

## 6. Seed demo data

Tao tai khoan demo:

```powershell
docker compose exec -T user_service python manage.py seed_demo_users
```

Tao 10 danh muc va 100 san pham healthcare/pharmacy:

```powershell
docker compose exec -T product_service python manage.py seed_products
```

Tai khoan demo:

| Vai tro | Email | Password |
|---|---|---|
| Customer | `customer@example.com` | `Password123!` |
| Staff | `staff@example.com` | `Password123!` |
| Admin | `admin@example.com` | `Password123!` |

Mat khau nay chi dung cho demo local.

## 7. Tai khoan dang nhap theo tung web

Sau khi da chay `seed_demo_users`, dung cac tai khoan sau de dang nhap:

| Web/Giao dien | URL | Email | Password | Ghi chu |
|---|---|---|---|---|
| Customer Web | `http://localhost:5173/customer/login` | `customer@example.com` | `Password123!` | Dung cho luong khach hang: products, cart, checkout, orders, chatbot |
| Staff Web | `http://localhost:5173/staff/login` | `staff@example.com` | `Password123!` | Dung cho dashboard nhan vien, quan ly products/orders/shipping/customers |
| Django Admin cua User Service | `http://localhost:8001/admin/` | `admin@example.com` | `Password123!` | Dung de xem/quan ly user demo trong `user_service` |

Luu y:

- Customer login va Staff login la hai trang rieng biet tren frontend.
- Frontend chi goi API qua API Gateway `http://localhost:8000`.
- Admin account nam trong database cua `user_service`, nen dang nhap Django admin qua `http://localhost:8001/admin/`.

## 8. Kiem tra backend qua API Gateway

Health check API Gateway:

```powershell
curl.exe http://localhost:8000/health/
```

Health check tat ca downstream services:

```powershell
curl.exe http://localhost:8000/health/services/
```

Kiem tra product catalog:

```powershell
curl.exe http://localhost:8000/api/products/
```

Dang nhap customer:

```powershell
curl.exe --% -X POST http://localhost:8000/api/auth/login/ -H "Content-Type: application/json" -d "{""email"":""customer@example.com"",""password"":""Password123!"",""role"":""customer""}"
```

Kiem tra chatbot:

```powershell
curl.exe --% -X POST http://localhost:8000/api/chat/ -H "Content-Type: application/json" -d "{""message"":""Suggest something for digestive support""}"
```

Neu cac lenh tren tra ve JSON hop le, backend da san sang cho demo.

## 9. Chay frontend

Mo terminal khac tai root project:

```powershell
cd frontend
npm run dev -- --host 0.0.0.0
```

Mo trinh duyet:

```text
http://localhost:5173
```

Cac route demo chinh:

| Flow | Route |
|---|---|
| Customer login | `http://localhost:5173/customer/login` |
| Customer register | `http://localhost:5173/customer/register` |
| Customer dashboard | `http://localhost:5173/customer/dashboard` |
| Browse products | `http://localhost:5173/customer/products` |
| Cart | `http://localhost:5173/customer/cart` |
| Checkout | `http://localhost:5173/customer/checkout` |
| Orders | `http://localhost:5173/customer/orders` |
| Chatbot | `http://localhost:5173/customer/chatbot` |
| Staff login | `http://localhost:5173/staff/login` |
| Staff dashboard | `http://localhost:5173/staff/dashboard` |
| Staff products | `http://localhost:5173/staff/products` |
| Staff orders | `http://localhost:5173/staff/orders` |
| Staff shipping | `http://localhost:5173/staff/shipping` |
| Staff customers | `http://localhost:5173/staff/customers` |

## 10. Demo flow de trinh bay

Dung flow ngan gon nay khi bao cao:

1. Mo `http://localhost:5173/customer/login`.
2. Dang nhap bang `customer@example.com` va `Password123!`.
3. Vao Products de xem catalog 10 danh muc va 100 san pham.
4. Tim kiem hoac loc san pham.
5. Them san pham vao cart.
6. Vao cart va checkout voi thong tin giao hang demo.
7. Kiem tra order duoc tao, payment o trang thai `pending`, shipment o trang thai `pending`.
8. Dang xuat hoac mo route `http://localhost:5173/staff/login`.
9. Dang nhap bang `staff@example.com` va `Password123!`.
10. Vao Staff Orders de xem don hang.
11. Vao Staff Shipping de cap nhat trang thai giao hang.
12. Quay lai Customer Orders de xem lich su don hang.
13. Vao Customer Chatbot va hoi goi y san pham, vi du: `Suggest something for digestive support`.

## 11. Chatbot artifacts

Artifacts da duoc tich hop san tai:

```text
services/chatbot_service/artifacts/
```

Neu can train lai model:

```powershell
python ml/generate_chatbot_datasets.py
python ml/train_chatbot.py
Copy-Item ml\artifacts\* services\chatbot_service\artifacts\ -Force
docker compose up --build -d chatbot_service
```

Chatbot dung TF-IDF va Logistic Regression baseline tren du lieu tu seed data. Neu artifact bi thieu hoac loi load, chatbot se tra ve safe fallback thay vi lam service crash.

## 12. Lenh dung va restart

Dung toan bo backend:

```powershell
docker compose down
```

Restart backend:

```powershell
docker compose up -d
```

Rebuild mot service, vi du chatbot:

```powershell
docker compose up --build -d chatbot_service
```

Xem log nhanh:

```powershell
docker compose logs --tail=80 api_gateway
docker compose logs --tail=80 user_service
docker compose logs --tail=80 product_service
docker compose logs --tail=80 order_service
docker compose logs --tail=80 chatbot_service
```

## 13. Loi thuong gap

| Loi | Cach xu ly |
|---|---|
| `docker compose` khong chay | Mo Docker Desktop va doi Docker engine san sang |
| Port 8000 hoac 5173 bi chiem | Tat process dang dung port do roi chay lai |
| Login that bai | Chay lai `seed_demo_users` |
| Product list rong | Chay lai `seed_products` |
| Frontend goi API loi | Kiem tra `frontend/.env` co `VITE_API_BASE_URL=http://localhost:8000` |
| Gateway bao downstream unavailable | Chay `docker compose ps` va `docker compose logs --tail=80 <service_name>` |
| Chatbot tra ve fallback | Kiem tra artifacts trong `services/chatbot_service/artifacts/` va restart `chatbot_service` |

## 14. Checklist truoc khi demo

- [ ] Docker Desktop dang chay.
- [ ] `docker compose ps` hien cac backend service running.
- [ ] `curl.exe http://localhost:8000/health/` tra ve `api_gateway` va `ok`.
- [ ] `curl.exe http://localhost:8000/health/services/` khong co service unreachable.
- [ ] Demo users da duoc seed.
- [ ] Product catalog da duoc seed.
- [ ] Frontend dang chay tai `http://localhost:5173`.
- [ ] Customer login thanh cong.
- [ ] Staff login thanh cong.
- [ ] Chatbot tra ve response an toan, khong chan doan benh.
