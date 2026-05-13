import PlaceholderPage from "../../components/common/PlaceholderPage.jsx";

export default function OrdersPage() {
  return (
    <PlaceholderPage
      title="Your Orders"
      description="Placeholder for customer order history, payment state, and shipping progress."
      role="Customer"
      route="/customer/orders"
      nextReference="your_orders_pharmacare"
    />
  );
}
