import { Filter, Plus } from "lucide-react";
import ModalForm from "../../components/staff/ModalForm.jsx";
import ProductTable from "../../components/staff/ProductTable.jsx";
import StaffShell from "../../components/staff/StaffShell.jsx";
import { inventoryRows } from "../../data/staffMockData.js";

export default function StaffProductsPage() {
  return (
    <StaffShell title="Product Inventory" subtitle="Manage healthcare product catalog records with mock inventory data.">
      <div className="mb-5 flex flex-col justify-between gap-3 rounded-xl border border-pharmacare-line bg-white p-4 shadow-soft lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {["All Categories", "Stock Status", "Active Products"].map((label) => (
            <button key={label} className="inline-flex h-10 items-center gap-2 rounded-xl border border-pharmacare-line bg-white px-4 text-sm font-semibold text-pharmacare-muted hover:bg-pharmacare-low">
              <Filter size={16} />
              {label}
            </button>
          ))}
        </div>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-pharmacare-primary px-4 text-sm font-semibold text-white hover:bg-pharmacare-primaryHover">
          <Plus size={17} />
          Add Product
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <ProductTable products={inventoryRows} />
        <ModalForm title="Add New Product" />
      </div>
    </StaffShell>
  );
}
