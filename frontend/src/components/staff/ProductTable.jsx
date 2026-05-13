import { Edit3, MoreHorizontal, Search } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function ProductTable({ products }) {
  return (
    <section className="overflow-hidden rounded-xl border border-pharmacare-line bg-white shadow-soft">
      <div className="flex flex-col justify-between gap-3 border-b border-pharmacare-line p-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-semibold text-pharmacare-ink">Product Inventory</h2>
          <p className="mt-1 text-sm text-pharmacare-muted">{products.length} mock products shown</p>
        </div>
        <label className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={17} />
          <input className="h-10 w-full rounded-xl border border-pharmacare-line bg-pharmacare-low pl-10 pr-3 text-sm outline-none focus:border-pharmacare-primary focus:bg-white" placeholder="Search SKU or name" type="search" />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead className="border-b border-pharmacare-line bg-pharmacare-low text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">
            <tr>
              <th className="px-5 py-3">Product Information</th>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharmacare-line">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-pharmacare-low/70">
                <td className="px-5 py-4">
                  <p className="font-semibold text-pharmacare-ink">{product.name}</p>
                  <p className="mt-1 text-sm text-pharmacare-muted">{product.category}</p>
                </td>
                <td className="px-5 py-4 text-sm text-pharmacare-muted">{product.sku}</td>
                <td className="px-5 py-4 text-sm font-semibold text-pharmacare-ink">{product.price}</td>
                <td className="px-5 py-4 text-sm text-pharmacare-muted">{product.stock} units</td>
                <td className="px-5 py-4"><StatusBadge status={product.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg border border-pharmacare-line p-2 text-pharmacare-muted hover:bg-pharmacare-low" aria-label="Edit product">
                      <Edit3 size={16} />
                    </button>
                    <button className="rounded-lg border border-pharmacare-line p-2 text-pharmacare-muted hover:bg-pharmacare-low" aria-label="More product actions">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
