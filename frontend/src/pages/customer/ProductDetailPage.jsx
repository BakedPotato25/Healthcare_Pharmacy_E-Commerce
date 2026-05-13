import { useParams } from "react-router-dom";
import PlaceholderPage from "../../components/common/PlaceholderPage.jsx";

export default function ProductDetailPage() {
  const { id } = useParams();

  return (
    <PlaceholderPage
      title="Product Detail"
      description={`Placeholder for product information, safe usage notes, and add-to-cart controls. Current product id: ${id ?? "not selected"}.`}
      role="Customer"
      route="/customer/products/:id"
      nextReference="product_details_pharmacare"
    />
  );
}
