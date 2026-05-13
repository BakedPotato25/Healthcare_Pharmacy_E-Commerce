import { useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { addCartItem } from "../../api/cartApi.js";
import { normalizeProduct } from "../../api/normalizers.js";
import { getCategories, getProducts } from "../../api/productApi.js";
import CustomerShell from "../../components/customer/CustomerShell.jsx";
import ProductCard from "../../components/customer/ProductCard.jsx";
import { categories as fallbackCategories, products as fallbackProducts } from "../../data/customerMockData.js";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [notice, setNotice] = useState("");
  const [cartNotice, setCartNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const visibleCategories = useMemo(() => (categories.length ? categories : fallbackCategories), [categories]);

  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      setIsLoading(true);
      try {
        const [categoryData, productData] = await Promise.all([
          getCategories(),
          getProducts({ search, category: selectedCategory, sort }),
        ]);
        if (!isMounted) {
          return;
        }
        setCategories(categoryData.map((category) => ({ ...category, count: 10 })));
        setProducts(productData.map(normalizeProduct));
        setNotice("");
      } catch {
        if (!isMounted) {
          return;
        }
        setCategories(fallbackCategories);
        setProducts(fallbackProducts.map((product) => ({ ...product, isFallback: true })));
        setNotice("Using fallback demo catalog because the API Gateway or product service is unavailable.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, [search, selectedCategory, sort]);

  const handleAddToCart = async (product) => {
    setCartNotice("");
    if (product.isFallback) {
      setCartNotice("Fallback demo products cannot be added to the backend cart.");
      return;
    }
    try {
      await addCartItem({ productId: product.id, quantity: 1 });
      setCartNotice(`${product.name} added to cart.`);
    } catch (apiError) {
      setCartNotice(apiError.message || "Unable to add product to cart.");
    }
  };

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
              {visibleCategories.map((category) => (
                <label key={category.name} className="flex items-center justify-between gap-3 text-sm text-pharmacare-muted">
                  <span className="flex items-center gap-2">
                    <input
                      className="rounded border-pharmacare-line text-pharmacare-primary focus:ring-pharmacare-primary"
                      type="checkbox"
                      checked={selectedCategory === (category.slug || category.name)}
                      onChange={(event) => setSelectedCategory(event.target.checked ? (category.slug || category.name) : "")}
                    />
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
          {notice ? <p className="mb-4 rounded-xl bg-pharmacare-warningSoft px-4 py-3 text-sm font-medium text-pharmacare-warning">{notice}</p> : null}
          {cartNotice ? <p className="mb-4 rounded-xl bg-pharmacare-primarySoft px-4 py-3 text-sm font-medium text-pharmacare-primary">{cartNotice}</p> : null}
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-pharmacare-line bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between">
            <label className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
              <input className="h-11 w-full rounded-full bg-pharmacare-low pl-10 pr-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-pharmacare-primary/15" onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." type="search" value={search} />
            </label>
            <select className="h-11 rounded-xl border border-pharmacare-line bg-white px-3 text-sm text-pharmacare-muted outline-none focus:border-pharmacare-primary" onChange={(event) => setSort(event.target.value)} value={sort}>
              <option value="">Sort by relevance</option>
              <option value="price">Price: low to high</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading ? <p className="text-sm text-pharmacare-muted">Loading products...</p> : products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>
      </div>
    </CustomerShell>
  );
}
