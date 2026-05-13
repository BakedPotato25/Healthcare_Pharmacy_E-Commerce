import { useParams } from "react-router-dom";
import { ChevronRight, Minus, Plus, ShieldCheck, ShoppingCart } from "lucide-react";
import CustomerShell from "../../components/customer/CustomerShell.jsx";
import ProductCard from "../../components/customer/ProductCard.jsx";
import StatusBadge from "../../components/customer/StatusBadge.jsx";
import { formatCurrency, products } from "../../data/customerMockData.js";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id) ?? products[0];
  const relatedProducts = products.filter((item) => item.id !== product.id).slice(0, 3);

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
            <p className="mt-3 text-lg text-pharmacare-muted">{product.brand} • {product.strength}</p>
            <p className="mt-6 text-3xl font-semibold text-pharmacare-primary">{formatCurrency(product.price)}</p>
            <p className="mt-6 max-w-xl leading-7 text-pharmacare-muted">{product.detail}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-11 w-36 overflow-hidden rounded-xl border border-pharmacare-line bg-pharmacare-low">
                <button className="flex flex-1 items-center justify-center text-pharmacare-muted hover:bg-white" aria-label="Decrease quantity">
                  <Minus size={17} />
                </button>
                <span className="flex flex-1 items-center justify-center border-x border-pharmacare-line bg-white text-sm font-semibold">1</span>
                <button className="flex flex-1 items-center justify-center text-pharmacare-muted hover:bg-white" aria-label="Increase quantity">
                  <Plus size={17} />
                </button>
              </div>
              <button className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-pharmacare-primary px-5 text-sm font-semibold text-white shadow-soft hover:bg-pharmacare-primaryHover">
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
            <p className="max-w-4xl leading-7 text-pharmacare-muted">
              {product.description} This mock detail page shows how customer-facing product information will be structured before real catalog APIs are connected.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-pharmacare-ink">Related Products</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </main>
    </CustomerShell>
  );
}
