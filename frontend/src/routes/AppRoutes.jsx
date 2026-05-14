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
import { getAccessToken, getStoredUser } from "../api/apiClient.js";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function AppRoutes() {
  const user = getStoredUser();
  const isAuthenticated = Boolean(getAccessToken());
  const isCustomerAuthenticated = isAuthenticated && user?.role === "customer";
  const isStaffAuthenticated = isAuthenticated && ["staff", "admin"].includes(user?.role);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customer/login" replace />} />

      <Route path="/customer/login" element={<CustomerLoginPage />} />
      <Route path="/customer/register" element={<CustomerRegisterPage />} />
      <Route path="/customer/dashboard" element={<ProtectedRoute isAllowed={isCustomerAuthenticated}><CustomerDashboardPage /></ProtectedRoute>} />
      <Route path="/customer/products" element={<ProtectedRoute isAllowed={isCustomerAuthenticated}><ProductListPage /></ProtectedRoute>} />
      <Route path="/customer/products/:id" element={<ProtectedRoute isAllowed={isCustomerAuthenticated}><ProductDetailPage /></ProtectedRoute>} />
      <Route path="/customer/cart" element={<ProtectedRoute isAllowed={isCustomerAuthenticated}><CartPage /></ProtectedRoute>} />
      <Route path="/customer/checkout" element={<ProtectedRoute isAllowed={isCustomerAuthenticated}><CheckoutPage /></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute isAllowed={isCustomerAuthenticated}><OrdersPage /></ProtectedRoute>} />
      <Route path="/customer/chatbot" element={<ProtectedRoute isAllowed={isCustomerAuthenticated}><ChatbotPage /></ProtectedRoute>} />

      <Route path="/staff/login" element={<StaffLoginPage />} />
      <Route path="/staff/dashboard" element={<ProtectedRoute isAllowed={isStaffAuthenticated} redirectTo="/staff/login"><StaffDashboardPage /></ProtectedRoute>} />
      <Route path="/staff/products" element={<ProtectedRoute isAllowed={isStaffAuthenticated} redirectTo="/staff/login"><StaffProductsPage /></ProtectedRoute>} />
      <Route path="/staff/orders" element={<ProtectedRoute isAllowed={isStaffAuthenticated} redirectTo="/staff/login"><StaffOrdersPage /></ProtectedRoute>} />
      <Route path="/staff/shipping" element={<ProtectedRoute isAllowed={isStaffAuthenticated} redirectTo="/staff/login"><StaffShippingPage /></ProtectedRoute>} />
      <Route path="/staff/customers" element={<ProtectedRoute isAllowed={isStaffAuthenticated} redirectTo="/staff/login"><StaffCustomersPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/customer/login" replace />} />
    </Routes>
  );
}
