import { Filter, Search } from "lucide-react";
import CustomerShell from "../../components/customer/CustomerShell.jsx";
import ProductCard from "../../components/customer/ProductCard.jsx";
import { categories, products } from "../../data/customerMockData.js";

export default function ProductListPage() {
  return (
    <CustomerShell withSidebar>
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-semibold text-pharmacare-ink">Shop Products</h1>
          <p className="mt-2 text-pharmacare-muted">Find healthcare, wellness, and pharmacy products for the academic demo catalog.</p>
        </div>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-pharmacare-line bg-white px-4 text-sm font-semibold text-pharmacare-ink shadow-soft lg:hidden">
          <Filter size={17} />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 space-y-8 lg:block">
          <div>
            <h2 className="mb-4 font-semibold text-pharmacare-ink">Category</h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <label key={category.name} className="flex items-center justify-between gap-3 text-sm text-pharmacare-muted">
                  <span className="flex items-center gap-2">
                    <input className="rounded border-pharmacare-line text-pharmacare-primary focus:ring-pharmacare-primary" type="checkbox" defaultChecked={category.name === "Vitamins & Minerals"} />
                    {category.name}
                  </span>
                  <span className="text-xs">{category.count}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-4 font-semibold text-pharmacare-ink">Price</h2>
            <div className="rounded-xl border border-pharmacare-line bg-white p-4 shadow-soft">
              <div className="h-2 rounded-full bg-pharmacare-low">
                <div className="h-2 w-2/3 rounded-full bg-pharmacare-primary" />
              </div>
              <div className="mt-3 flex justify-between text-xs font-semibold text-pharmacare-muted">
                <span>$0</span>
                <span>$75</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-pharmacare-line bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between">
            <label className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
              <input className="h-11 w-full rounded-full bg-pharmacare-low pl-10 pr-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-pharmacare-primary/15" placeholder="Search products..." type="search" />
            </label>
            <select className="h-11 rounded-xl border border-pharmacare-line bg-white px-3 text-sm text-pharmacare-muted outline-none focus:border-pharmacare-primary">
              <option>Sort by relevance</option>
              <option>Price: low to high</option>
              <option>Name</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </CustomerShell>
  );
}
