import { X } from "lucide-react";

export default function ModalForm({ title = "Add New Product" }) {
  return (
    <aside className="rounded-xl border border-pharmacare-line bg-white p-5 shadow-panel">
      <div className="mb-5 flex items-center justify-between border-b border-pharmacare-line pb-4">
        <div>
          <h2 className="text-xl font-semibold text-pharmacare-ink">{title}</h2>
          <p className="mt-1 text-sm text-pharmacare-muted">Static mock panel for product management.</p>
        </div>
        <button className="rounded-full p-2 text-pharmacare-muted hover:bg-pharmacare-low" aria-label="Close modal">
          <X size={18} />
        </button>
      </div>

      <form className="grid gap-4">
        {[
          ["Product Name", "e.g. Daily Vitamin C Complex"],
          ["NDC / SKU", "VIT-C-1000-60"],
          ["Wholesale Price", "18.99"],
          ["Initial Stock", "42"],
        ].map(([label, placeholder]) => (
          <label key={label}>
            <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">{label}</span>
            <input className="mt-2 h-11 w-full rounded-t-lg border-0 border-b-2 border-pharmacare-line bg-pharmacare-low px-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" placeholder={placeholder} type="text" />
          </label>
        ))}
        <label>
          <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Category</span>
          <select className="mt-2 h-11 w-full rounded-t-lg border-0 border-b-2 border-pharmacare-line bg-pharmacare-low px-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0">
            <option>Vitamins & Minerals</option>
            <option>Digestive Health</option>
            <option>Skincare</option>
            <option>Medical Devices</option>
          </select>
        </label>
        <button className="mt-2 h-11 rounded-xl bg-pharmacare-primary text-sm font-semibold text-white hover:bg-pharmacare-primaryHover" type="button">
          Save Product
        </button>
      </form>
    </aside>
  );
}
