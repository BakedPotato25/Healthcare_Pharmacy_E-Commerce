import { useEffect, useMemo, useState } from "react";
import { Filter, PackageCheck, Search } from "lucide-react";
import { isServiceUnavailable } from "../../api/apiClient.js";
import { normalizeOrder } from "../../api/normalizers.js";
import { getOrders } from "../../api/orderApi.js";
import CustomerShell from "../../components/customer/CustomerShell.jsx";
import StatusBadge from "../../components/customer/StatusBadge.jsx";
import { formatCurrency, orders as fallbackOrders } from "../../data/customerMockData.js";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const orderData = await getOrders();
        if (!isMounted) {
          return;
        }
        setOrders(orderData.map(normalizeOrder));
        setNotice("");
      } catch (apiError) {
        if (!isMounted) {
          return;
        }
        if (isServiceUnavailable(apiError)) {
          setOrders(fallbackOrders);
          setNotice("Using fallback demo orders because the API Gateway or orders endpoint is unavailable.");
        } else {
          setOrders([]);
          setNotice(apiError.message || "Unable to load orders from the API Gateway.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleOrders = useMemo(() => {
    if (!search) {
      return orders;
    }
    return orders.filter((order) => String(order.id).toLowerCase().includes(search.toLowerCase()));
  }, [orders, search]);

  return (
    <CustomerShell withSidebar>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-semibold text-pharmacare-ink">Order History</h1>
          <p className="mt-2 text-pharmacare-muted">View and track previous pharmacy orders.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
            <input className="h-11 rounded-xl border border-pharmacare-line bg-white pl-10 pr-4 text-sm outline-none focus:border-pharmacare-primary" onChange={(event) => setSearch(event.target.value)} placeholder="Search orders..." type="search" value={search} />
          </label>
          <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-pharmacare-line bg-white px-4 text-sm font-semibold text-pharmacare-ink">
            <Filter size={17} />
            Filter
          </button>
        </div>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto">
        {["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"].map((label, index) => (
          <button key={label} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold ${index === 0 ? "bg-pharmacare-primary text-white" : "border border-pharmacare-line bg-white text-pharmacare-muted hover:bg-pharmacare-low"}`}>
            {label}
          </button>
        ))}
      </div>

      {notice ? <p className="mb-5 rounded-xl bg-pharmacare-warningSoft px-4 py-3 text-sm font-medium text-pharmacare-warning">{notice}</p> : null}

      <section className="grid gap-4 xl:grid-cols-2">
        {isLoading ? <p className="text-sm text-pharmacare-muted">Loading orders...</p> : visibleOrders.map((order) => (
          <article key={order.id} className="rounded-xl border border-pharmacare-line bg-white p-5 shadow-soft transition hover:shadow-panel">
            <div className="flex items-start justify-between gap-4 border-b border-pharmacare-line pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Order #{order.id}</p>
                <p className="mt-1 text-sm text-pharmacare-muted">{order.date}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-4 space-y-2">
              {order.items.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-pharmacare-low p-3">
                  <PackageCheck size={18} className="text-pharmacare-primary" />
                  <span className="text-sm font-medium text-pharmacare-ink">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-pharmacare-line pt-4">
              <div>
                <p className="text-sm text-pharmacare-muted">{order.eta}</p>
                <p className="mt-1 font-semibold text-pharmacare-primary">{formatCurrency(order.total)}</p>
              </div>
              <button className="rounded-xl border border-pharmacare-line px-4 py-2 text-sm font-semibold text-pharmacare-ink hover:bg-pharmacare-low">
                {order.status === "delivered" ? "Reorder" : "Track Order"}
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl bg-pharmacare-primary p-6 text-white shadow-panel">
        <h2 className="text-xl font-semibold">Need help with an order?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">
          Order history is loaded through the API Gateway when backend services are available.
        </p>
        <button className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-pharmacare-primary">
          Contact Support
        </button>
      </section>
    </CustomerShell>
  );
}
