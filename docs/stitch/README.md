# Google Stitch UI References

This folder stores Google Stitch exports for the Healthcare Pharmacy E-Commerce frontend.

These files are design references only. They are not production frontend code.

## Reference Rules

- `DESIGN.md` is the main design system reference for colors, typography, spacing, layout style, and component direction.
- `raw_export/` contains the original Google Stitch screen folders.
- Each screen folder may include `screen.png` and `code.html`.
- `screen.png` is the visual reference for the target React page.
- `code.html` may be used only as a layout and style reference.
- Do not copy `code.html` directly into `frontend/src` as standalone HTML.
- Future implementation must convert the designs into React + Vite + Tailwind components.
- Reusable UI should live under `frontend/src/components/`.
- Page-level screens should live under `frontend/src/pages/`.

## Folder Layout

```text
docs/stitch/
  DESIGN.md
  README.md
  raw_export/
    admin_dashboard_pharmacare_staff/
    ai_health_consultant_pharmacare_1/
    ai_health_consultant_pharmacare_2/
    browse_healthcare_products_pharmacare/
    checkout_pharmacare/
    customer_crm_pharmacare_staff/
    customer_dashboard_pharmacare/
    customer_login_pharmacare/
    healthcare_e_commerce_design_system/
    inventory_management_pharmacare_staff/
    order_fulfillment_pharmacare_staff/
    product_details_pharmacare/
    shipping_logistics_pharmacare_staff/
    staff_portal_login_pharmacare/
    your_orders_pharmacare/
    your_shopping_cart_pharmacare/
```

## Screen To Route Mapping

| Stitch Folder | Target Route | React Page |
|---|---|---|
| `customer_login_pharmacare` | `/customer/login` | `frontend/src/pages/customer/CustomerLoginPage.jsx` |
| `customer_dashboard_pharmacare` | `/customer/dashboard` | `frontend/src/pages/customer/CustomerDashboardPage.jsx` |
| `browse_healthcare_products_pharmacare` | `/customer/products` | `frontend/src/pages/customer/ProductListPage.jsx` |
| `product_details_pharmacare` | `/customer/products/:id` | `frontend/src/pages/customer/ProductDetailPage.jsx` |
| `your_shopping_cart_pharmacare` | `/customer/cart` | `frontend/src/pages/customer/CartPage.jsx` |
| `checkout_pharmacare` | `/customer/checkout` | `frontend/src/pages/customer/CheckoutPage.jsx` |
| `your_orders_pharmacare` | `/customer/orders` | `frontend/src/pages/customer/OrdersPage.jsx` |
| `ai_health_consultant_pharmacare_1` | `/customer/chatbot` | `frontend/src/pages/customer/ChatbotPage.jsx` |
| `ai_health_consultant_pharmacare_2` | `/customer/chatbot` | `frontend/src/pages/customer/ChatbotPage.jsx` alternate chat state |
| `staff_portal_login_pharmacare` | `/staff/login` | `frontend/src/pages/staff/StaffLoginPage.jsx` |
| `admin_dashboard_pharmacare_staff` | `/staff/dashboard` | `frontend/src/pages/staff/StaffDashboardPage.jsx` |
| `inventory_management_pharmacare_staff` | `/staff/products` | `frontend/src/pages/staff/StaffProductsPage.jsx` |
| `order_fulfillment_pharmacare_staff` | `/staff/orders` | `frontend/src/pages/staff/StaffOrdersPage.jsx` |
| `shipping_logistics_pharmacare_staff` | `/staff/shipping` | `frontend/src/pages/staff/StaffShippingPage.jsx` |
| `customer_crm_pharmacare_staff` | `/staff/customers` | `frontend/src/pages/staff/StaffCustomersPage.jsx` |

## Missing Or Derived Screens

| Target Route | React Page | Design Source |
|---|---|---|
| `/customer/register` | `frontend/src/pages/customer/CustomerRegisterPage.jsx` | Derive from `customer_login_pharmacare` and `DESIGN.md` unless a dedicated Stitch export is added later. |

## Implementation Notes For Later Phases

- Read `DESIGN.md` before converting any screen.
- Use `screen.png` as the visual target.
- Use `code.html` only to understand spacing, hierarchy, and styling choices.
- Keep the customer and staff flows visually related but clearly separated.
- Frontend API calls must later go through the API Gateway base URL, not internal service ports.
