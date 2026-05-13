import { ShoppingCart } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import { formatCurrency } from "../../data/customerMockData.js";

export default function RecommendedProductCard({ product, compact = false }) {
  return (
    <article className="rounded-xl border border-pharmacare-line bg-white p-4 shadow-soft transition hover:shadow-panel">
      <div className="flex gap-4">
        <div className={`flex ${compact ? "h-16 w-16" : "h-20 w-20"} shrink-0 items-center justify-center rounded-xl ${product.accent}`}>
          <span className="font-semibold text-pharmacare-primary">{product.visual}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-pharmacare-ink">{product.name}</p>
            <StatusBadge status={product.badge} />
          </div>
          <p className="text-xs text-pharmacare-muted">{product.category}</p>
          <p className="mt-2 text-sm font-semibold text-pharmacare-primary">{formatCurrency(product.price)}</p>
        </div>
      </div>
      <button className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-pharmacare-primary px-4 text-xs font-semibold text-white hover:bg-pharmacare-primaryHover">
        <ShoppingCart size={15} />
        Add to Cart
      </button>
    </article>
  );
}
