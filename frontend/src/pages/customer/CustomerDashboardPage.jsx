import PlaceholderPage from "../../components/common/PlaceholderPage.jsx";

export default function CustomerDashboardPage() {
  return (
    <PlaceholderPage
      title="Customer Dashboard"
      description="Placeholder for customer account overview, order status, and recommended pharmacy products."
      role="Customer"
      route="/customer/dashboard"
      nextReference="customer_dashboard_pharmacare"
    />
  );
}
