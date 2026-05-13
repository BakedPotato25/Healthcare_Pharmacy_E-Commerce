import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight, Minus, Plus, ShieldCheck, ShoppingCart } from "lucide-react";
import { addCartItem } from "../../api/cartApi.js";
import { normalizeProduct } from "../../api/normalizers.js";
import { getProduct, getProducts } from "../../api/productApi.js";
import CustomerShell from "../../components/customer/CustomerShell.jsx";
import ProductCard from "../../components/customer/ProductCard.jsx";
import StatusBadge from "../../components/customer/StatusBadge.jsx";
import { formatCurrency, products as fallbackProducts } from "../../data/customerMockData.js";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const [cartNotice, setCartNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        const [productData, productList] = await Promise.all([getProduct(id), getProducts()]);
        if (!isMounted) {
          return;
        }
        const normalizedProduct = normalizeProduct(productData);
        setProduct(normalizedProduct);
        setRelatedProducts(productList.filter((item) => String(item.id) !== String(id)).slice(0, 3).map(normalizeProduct));
        setNotice("");
      } catch {
        if (!isMounted) {
          return;
        }
        const fallbackProduct = fallbackProducts.find((item) => String(item.id) === String(id)) ?? fallbackProducts[0];
        setProduct({ ...fallbackProduct, isFallback: true });
        setRelatedProducts(
          fallbackProducts
            .filter((item) => item.id !== fallbackProduct.id)
            .slice(0, 3)
            .map((item) => ({ ...item, isFallback: true })),
        );
        setNotice("Using fallback demo product because the API Gateway or product service is unavailable.");
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const productDescription = useMemo(() => product?.detail || product?.description || "", [product]);

  const handleAddToCart = async (selectedProduct = product, selectedQuantity = quantity) => {
    setCartNotice("");
    if (selectedProduct?.isFallback) {
      setCartNotice("Fallback demo products cannot be added to the backend cart.");
      return;
    }
    try {
      await addCartItem({ productId: selectedProduct.id, quantity: selectedQuantity });
      setCartNotice(`${selectedProduct.name} added to cart.`);
    } catch (apiError) {
      setCartNotice(apiError.message || "Unable to add product to cart.");
    }
  };

  if (!product) {
    return (
      <CustomerShell>
        <main className="mx-auto max-w-7xl px-4 py-8 text-sm text-pharmacare-muted sm:px-6 lg:px-8">Loading product...</main>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-pharmacare-muted">
          <span>Home</span>
          <ChevronRight size={16} />
          <span>Products</span>
          <ChevronRight size={16} />
          <span className="font-semibold text-pharmacare-primary">{product.name}</span>
        </nav>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-pharmacare-line bg-white p-8 shadow-soft">
            <div className={`flex h-full min-h-[320px] w-full items-center justify-center rounded-2xl ${product.accent}`}>
              <span className="flex h-36 w-36 items-center justify-center rounded-3xl border border-white/70 bg-white/85 text-4xl font-semibold text-pharmacare-primary shadow-panel">
                {product.visual}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-3 flex items-center gap-3">
              <StatusBadge status={product.badge} />
              <span className="text-sm font-medium text-pharmacare-muted">{product.category}</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-pharmacare-ink">{product.name}</h1>
            <p className="mt-3 text-lg text-pharmacare-muted">{product.brand} - {product.strength}</p>
            <p className="mt-6 text-3xl font-semibold text-pharmacare-primary">{formatCurrency(product.price)}</p>
            <p className="mt-6 max-w-xl leading-7 text-pharmacare-muted">{productDescription}</p>
            {notice ? <p className="mt-4 rounded-xl bg-pharmacare-warningSoft px-4 py-3 text-sm font-medium text-pharmacare-warning">{notice}</p> : null}
            {cartNotice ? <p className="mt-4 rounded-xl bg-pharmacare-primarySoft px-4 py-3 text-sm font-medium text-pharmacare-primary">{cartNotice}</p> : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-11 w-36 overflow-hidden rounded-xl border border-pharmacare-line bg-pharmacare-low">
                <button className="flex flex-1 items-center justify-center text-pharmacare-muted hover:bg-white disabled:opacity-50" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button">
                  <Minus size={17} />
                </button>
                <span className="flex flex-1 items-center justify-center border-x border-pharmacare-line bg-white text-sm font-semibold">{quantity}</span>
                <button className="flex flex-1 items-center justify-center text-pharmacare-muted hover:bg-white" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)} type="button">
                  <Plus size={17} />
                </button>
              </div>
              <button className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-pharmacare-primary px-5 text-sm font-semibold text-white shadow-soft hover:bg-pharmacare-primaryHover" onClick={() => handleAddToCart()} type="button">
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-pharmacare-line bg-pharmacare-primarySoft p-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 shrink-0 text-pharmacare-primary" size={20} />
                <p className="text-sm leading-6 text-pharmacare-muted">
                  Product information is for academic demo use only. Read product labels and ask a pharmacist or doctor before using products for health concerns.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-pharmacare-line bg-white shadow-soft">
          <div className="flex overflow-x-auto border-b border-pharmacare-line">
            {["Description", "Usage & Dosage", "Safety Note"].map((tab, index) => (
              <button key={tab} className={`px-6 py-4 text-sm font-semibold ${index === 0 ? "border-b-2 border-pharmacare-primary text-pharmacare-primary" : "text-pharmacare-muted hover:bg-pharmacare-low"}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6">
            <p className="max-w-4xl leading-7 text-pharmacare-muted">{product.description}</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-pharmacare-ink">Related Products</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} onAddToCart={(selectedProduct) => handleAddToCart(selectedProduct, 1)} />
            ))}
          </div>
        </section>
      </main>
    </CustomerShell>
  );
}
