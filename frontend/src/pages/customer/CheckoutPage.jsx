import PlaceholderPage from "../../components/common/PlaceholderPage.jsx";

export default function CheckoutPage() {
  return (
    <PlaceholderPage
      title="Checkout"
      description="Placeholder for shipping details, order review, and simulated payment workflow."
      role="Customer"
      route="/customer/checkout"
      nextReference="checkout_pharmacare"
    />
  );
}
