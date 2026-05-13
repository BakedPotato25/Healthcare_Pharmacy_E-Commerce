import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "../../data/customerMockData.js";

export default function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-pharmacare-line bg-white p-4 shadow-soft sm:flex-row">
      <div className={`flex h-28 w-full items-center justify-center rounded-xl ${item.accent} sm:w-28`}>
        <span className="text-lg font-semibold text-pharmacare-primary">{item.visual}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <div>
            <p className="text-lg font-semibold text-pharmacare-ink">{item.name}</p>
            <p className="mt-1 text-sm text-pharmacare-muted">{item.strength}</p>
            <p className="mt-2 text-sm text-pharmacare-muted">{item.brand} • {item.category}</p>
          </div>
          <p className="text-lg font-semibold text-pharmacare-ink">{formatCurrency(item.price * item.quantity)}</p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-pharmacare-line pt-4">
          <div className="flex overflow-hidden rounded-lg border border-pharmacare-line bg-pharmacare-low">
            <button
              className="px-3 text-pharmacare-muted hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Decrease quantity"
              type="button"
              disabled={item.quantity <= 1 || !onUpdateQuantity}
              onClick={() => onUpdateQuantity?.(item, item.quantity - 1)}
            >
              <Minus size={16} />
            </button>
            <span className="border-x border-pharmacare-line bg-white px-4 py-1.5 text-sm font-semibold text-pharmacare-ink">
              {item.quantity}
            </span>
            <button
              className="px-3 text-pharmacare-muted hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Increase quantity"
              type="button"
              disabled={!onUpdateQuantity}
              onClick={() => onUpdateQuantity?.(item, item.quantity + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-pharmacare-danger hover:bg-pharmacare-dangerSoft disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={!onRemove}
            onClick={() => onRemove?.(item)}
          >
            <Trash2 size={16} />
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
