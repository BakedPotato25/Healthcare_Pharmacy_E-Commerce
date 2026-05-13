import PlaceholderPage from "../../components/common/PlaceholderPage.jsx";

export default function CustomerLoginPage() {
  return (
    <PlaceholderPage
      title="Customer Login"
      description="Placeholder for the customer login flow. Authentication will be connected through the API Gateway in a later phase."
      role="Customer"
      route="/customer/login"
      nextReference="customer_login_pharmacare"
    />
  );
}
