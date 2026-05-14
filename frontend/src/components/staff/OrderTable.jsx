import { Printer, Search } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function OrderTable({ orders, compact = false, notice }) {
  return (
    <section className="overflow-hidden rounded-xl border border-pharmacare-line bg-white shadow-soft">
      <div className="flex flex-col justify-between gap-3 border-b border-pharmacare-line p-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-semibold text-pharmacare-ink">{compact ? "Recent Orders" : "Order Queue"}</h2>
          <p className="mt-1 text-sm text-pharmacare-muted">{notice || "Order data for staff fulfillment."}</p>
        </div>
        {!compact ? (
          <label className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={17} />
            <input className="h-10 w-full rounded-xl border border-pharmacare-line bg-pharmacare-low pl-10 pr-3 text-sm outline-none focus:border-pharmacare-primary focus:bg-white" placeholder="Search orders" type="search" />
          </label>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-pharmacare-line bg-pharmacare-low text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Payment</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharmacare-line">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-pharmacare-low/70">
                <td className="px-5 py-4">
                  <p className="font-semibold text-pharmacare-ink">{order.id}</p>
                  <p className="mt-1 text-xs text-pharmacare-muted">{order.created}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-pharmacare-ink">{order.customer}</p>
                  <p className="mt-1 text-sm text-pharmacare-muted">{order.items} items</p>
                </td>
                <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                <td className="px-5 py-4"><StatusBadge status={order.payment} /></td>
                <td className="px-5 py-4 font-semibold text-pharmacare-ink">{order.total}</td>
                <td className="px-5 py-4 text-right">
                  <button className="inline-flex items-center gap-2 rounded-lg border border-pharmacare-line px-3 py-2 text-sm font-semibold text-pharmacare-ink hover:bg-pharmacare-low">
                    <Printer size={15} />
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
