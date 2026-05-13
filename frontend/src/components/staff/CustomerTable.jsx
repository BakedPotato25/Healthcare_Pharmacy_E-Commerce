import { Mail, Search } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function CustomerTable({ customers }) {
  return (
    <section className="overflow-hidden rounded-xl border border-pharmacare-line bg-white shadow-soft">
      <div className="flex flex-col justify-between gap-3 border-b border-pharmacare-line p-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-semibold text-pharmacare-ink">Customer Directory</h2>
          <p className="mt-1 text-sm text-pharmacare-muted">Staff-only CRM view with mock customer activity.</p>
        </div>
        <label className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={17} />
          <input className="h-10 w-full rounded-xl border border-pharmacare-line bg-pharmacare-low pl-10 pr-3 text-sm outline-none focus:border-pharmacare-primary focus:bg-white" placeholder="Search name or email" type="search" />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-pharmacare-line bg-pharmacare-low text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3 text-center">Orders</th>
              <th className="px-5 py-3">Last Active</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharmacare-line">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-pharmacare-low/70">
                <td className="px-5 py-4">
                  <p className="font-semibold text-pharmacare-ink">{customer.name}</p>
                  <p className="mt-1 text-xs text-pharmacare-muted">{customer.segment}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 text-sm text-pharmacare-muted">
                    <Mail size={15} />
                    {customer.email}
                  </span>
                </td>
                <td className="px-5 py-4 text-center font-semibold text-pharmacare-primary">{customer.orders}</td>
                <td className="px-5 py-4 text-sm text-pharmacare-muted">{customer.lastActive}</td>
                <td className="px-5 py-4"><StatusBadge status={customer.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
