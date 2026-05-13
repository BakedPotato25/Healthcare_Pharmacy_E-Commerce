import { Navigate, Route, Routes } from "react-router-dom";
import CustomerLoginPage from "../pages/customer/CustomerLoginPage.jsx";
import CustomerRegisterPage from "../pages/customer/CustomerRegisterPage.jsx";
import CustomerDashboardPage from "../pages/customer/CustomerDashboardPage.jsx";
import ProductListPage from "../pages/customer/ProductListPage.jsx";
import ProductDetailPage from "../pages/customer/ProductDetailPage.jsx";
import CartPage from "../pages/customer/CartPage.jsx";
import CheckoutPage from "../pages/customer/CheckoutPage.jsx";
import OrdersPage from "../pages/customer/OrdersPage.jsx";
import ChatbotPage from "../pages/customer/ChatbotPage.jsx";
import StaffLoginPage from "../pages/staff/StaffLoginPage.jsx";
import StaffDashboardPage from "../pages/staff/StaffDashboardPage.jsx";
import StaffProductsPage from "../pages/staff/StaffProductsPage.jsx";
import StaffOrdersPage from "../pages/staff/StaffOrdersPage.jsx";
import StaffShippingPage from "../pages/staff/StaffShippingPage.jsx";
import StaffCustomersPage from "../pages/staff/StaffCustomersPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customer/login" replace />} />

      <Route path="/customer/login" element={<CustomerLoginPage />} />
      <Route path="/customer/register" element={<CustomerRegisterPage />} />
      <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
      <Route path="/customer/products" element={<ProductListPage />} />
      <Route path="/customer/products/:id" element={<ProductDetailPage />} />
      <Route path="/customer/cart" element={<CartPage />} />
      <Route path="/customer/checkout" element={<CheckoutPage />} />
      <Route path="/customer/orders" element={<OrdersPage />} />
      <Route path="/customer/chatbot" element={<ChatbotPage />} />

      <Route path="/staff/login" element={<StaffLoginPage />} />
      <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
      <Route path="/staff/products" element={<StaffProductsPage />} />
      <Route path="/staff/orders" element={<StaffOrdersPage />} />
      <Route path="/staff/shipping" element={<StaffShippingPage />} />
      <Route path="/staff/customers" element={<StaffCustomersPage />} />

      <Route path="*" element={<Navigate to="/customer/login" replace />} />
    </Routes>
  );
}
