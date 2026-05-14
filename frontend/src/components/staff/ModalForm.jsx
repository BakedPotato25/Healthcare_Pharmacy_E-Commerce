import { X } from "lucide-react";

export default function ModalForm({
  title = "Add New Product",
  categories = [],
  form,
  isSubmitting = false,
  onChange,
  onSubmit,
  onCancel,
}) {
  const categoryOptions = categories.length ? categories : [
    { id: "", name: "Vitamins & Minerals" },
    { id: "", name: "Digestive Health" },
    { id: "", name: "Skincare" },
    { id: "", name: "Medical Devices" },
  ];

  return (
    <aside className="rounded-xl border border-pharmacare-line bg-white p-5 shadow-panel">
      <div className="mb-5 flex items-center justify-between border-b border-pharmacare-line pb-4">
        <div>
          <h2 className="text-xl font-semibold text-pharmacare-ink">{title}</h2>
          <p className="mt-1 text-sm text-pharmacare-muted">Create or edit catalog records through the API Gateway.</p>
        </div>
        <button className="rounded-full p-2 text-pharmacare-muted hover:bg-pharmacare-low" aria-label="Close modal" onClick={onCancel} type="button">
          <X size={18} />
        </button>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <label>
          <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Product Name</span>
          <input className="mt-2 h-11 w-full rounded-t-lg border-0 border-b-2 border-pharmacare-line bg-pharmacare-low px-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" name="name" onChange={onChange} placeholder="e.g. Daily Vitamin C Complex" type="text" value={form?.name ?? ""} />
        </label>
        <label>
          <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Brand</span>
          <input className="mt-2 h-11 w-full rounded-t-lg border-0 border-b-2 border-pharmacare-line bg-pharmacare-low px-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" name="brand" onChange={onChange} placeholder="PharmaCare" type="text" value={form?.brand ?? ""} />
        </label>
        <label>
          <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Price</span>
          <input className="mt-2 h-11 w-full rounded-t-lg border-0 border-b-2 border-pharmacare-line bg-pharmacare-low px-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" name="price" onChange={onChange} placeholder="18.99" type="number" min="0" step="0.01" value={form?.price ?? ""} />
        </label>
        <label>
          <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Stock</span>
          <input className="mt-2 h-11 w-full rounded-t-lg border-0 border-b-2 border-pharmacare-line bg-pharmacare-low px-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" name="stock" onChange={onChange} placeholder="42" type="number" min="0" value={form?.stock ?? ""} />
        </label>
        <label>
          <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Category</span>
          <select className="mt-2 h-11 w-full rounded-t-lg border-0 border-b-2 border-pharmacare-line bg-pharmacare-low px-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" name="category" onChange={onChange} value={form?.category ?? ""}>
            <option value="">Select category</option>
            {categoryOptions.map((category) => (
              <option key={category.id || category.name} value={category.id || category.name}>{category.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Description</span>
          <textarea className="mt-2 min-h-20 w-full rounded-t-lg border-0 border-b-2 border-pharmacare-line bg-pharmacare-low px-4 py-3 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" name="description" onChange={onChange} placeholder="Short product description" value={form?.description ?? ""} />
        </label>
        <button className="mt-2 h-11 rounded-xl bg-pharmacare-primary text-sm font-semibold text-white hover:bg-pharmacare-primaryHover disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </form>
    </aside>
  );
}
