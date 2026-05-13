import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import { formatCurrency } from "../../data/customerMockData.js";

export default function ProductCard({ product, onAddToCart, disabled = false }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-pharmacare-line bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-panel">
      <div className={`relative mb-4 flex aspect-[4/3] items-center justify-center rounded-xl ${product.accent}`}>
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-xl font-semibold text-pharmacare-primary shadow-soft">
          {product.visual}
        </span>
        <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-pharmacare-muted shadow-soft hover:text-pharmacare-primary" aria-label="Save product">
          <Heart size={18} />
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">{product.category}</p>
        <StatusBadge status={product.badge} />
      </div>

      <Link to={`/customer/products/${product.id}`} className="text-lg font-semibold text-pharmacare-ink hover:text-pharmacare-primary">
        {product.name}
      </Link>
      <p className="mt-1 text-sm text-pharmacare-muted">{product.strength}</p>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-pharmacare-muted">{product.description}</p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="text-xl font-semibold text-pharmacare-ink">{formatCurrency(product.price)}</span>
        <button
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-pharmacare-primary px-3 text-sm font-semibold text-white transition hover:bg-pharmacare-primaryHover disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={disabled}
          onClick={() => onAddToCart?.(product)}
        >
          <ShoppingCart size={17} />
          Add
        </button>
      </div>
    </article>
  );
}
