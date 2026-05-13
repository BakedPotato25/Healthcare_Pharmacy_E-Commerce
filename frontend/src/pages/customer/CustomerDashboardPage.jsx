import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, PackageCheck, Search, ShieldCheck, ShoppingCart } from "lucide-react";
import CustomerShell from "../../components/customer/CustomerShell.jsx";
import ProductCard from "../../components/customer/ProductCard.jsx";
import StatusBadge from "../../components/customer/StatusBadge.jsx";
import { categories, dashboardStats, orders, products } from "../../data/customerMockData.js";

export default function CustomerDashboardPage() {
  return (
    <CustomerShell withSidebar>
      <section className="rounded-2xl border border-pharmacare-line bg-pharmacare-secondary p-6 text-white shadow-panel lg:p-8">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            <ShieldCheck size={17} />
            Customer healthcare portal
          </p>
          <h1 className="text-3xl font-semibold leading-tight lg:text-5xl">Your trusted healthcare shopping assistant</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/85">
            Browse pharmacy products, track orders, and use safe AI product consultation for general category guidance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-pharmacare-primary" to="/customer/products">
              Shop products
              <ArrowRight size={17} />
            </Link>
            <Link className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/40 px-4 text-sm font-semibold text-white" to="/customer/chatbot">
              Ask AI assistant
              <MessageCircle size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-pharmacare-line bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-pharmacare-muted">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-pharmacare-ink">{stat.value}</p>
            <p className="mt-1 text-sm text-pharmacare-muted">{stat.helper}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-pharmacare-ink">Shop by health need</h2>
          <Link className="text-sm font-semibold text-pharmacare-primary" to="/customer/products">View all</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.slice(0, 5).map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} className="group rounded-xl border border-pharmacare-line bg-white p-4 text-center shadow-soft transition hover:border-pharmacare-primary hover:shadow-panel" to="/customer/products">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pharmacare-low text-pharmacare-primary group-hover:bg-pharmacare-primary group-hover:text-white">
                  <Icon size={24} />
                </span>
                <span className="mt-3 block text-sm font-semibold text-pharmacare-ink">{category.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-pharmacare-ink">Recommended For You</h2>
          <div className="flex gap-2 text-pharmacare-muted">
            <Search size={19} />
            <ShoppingCart size={19} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.45fr]">
        <div className="rounded-xl border border-pharmacare-line bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between border-b border-pharmacare-line pb-3">
            <h2 className="text-xl font-semibold text-pharmacare-ink">Recent Orders</h2>
            <Link className="text-sm font-semibold text-pharmacare-primary" to="/customer/orders">View History</Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 2).map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl p-3 hover:bg-pharmacare-low">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pharmacare-primarySoft text-pharmacare-primary">
                    <PackageCheck size={20} />
                  </span>
                  <div>
                    <p className="font-semibold text-pharmacare-ink">Order #{order.id}</p>
                    <p className="text-sm text-pharmacare-muted">{order.eta}</p>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-pharmacare-line bg-pharmacare-primary p-5 text-white shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/75">PharmaCare AI</p>
          <h2 className="mt-3 text-xl font-semibold">Need product guidance?</h2>
          <p className="mt-3 text-sm leading-6 text-white/85">
            Ask for general product category suggestions for skincare, oral care, digestive support, first aid, and vitamins.
          </p>
          <Link className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-pharmacare-primary" to="/customer/chatbot">
            Start chat
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </CustomerShell>
  );
}
