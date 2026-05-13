import { MoreHorizontal } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function ShippingTable({ shipments }) {
  return (
    <section className="overflow-hidden rounded-xl border border-pharmacare-line bg-white shadow-soft">
      <div className="border-b border-pharmacare-line p-4">
        <h2 className="text-xl font-semibold text-pharmacare-ink">Recent Shipments</h2>
        <p className="mt-1 text-sm text-pharmacare-muted">Update simulated shipment status for outbound orders.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-left">
          <thead className="border-b border-pharmacare-line bg-pharmacare-low text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">
            <tr>
              <th className="px-5 py-3">Shipment</th>
              <th className="px-5 py-3">Recipient</th>
              <th className="px-5 py-3">Carrier</th>
              <th className="px-5 py-3">Tracking</th>
              <th className="px-5 py-3">ETA</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharmacare-line">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-pharmacare-low/70">
                <td className="px-5 py-4">
                  <p className="font-semibold text-pharmacare-ink">{shipment.id}</p>
                  <p className="mt-1 text-xs text-pharmacare-muted">{shipment.orderId}</p>
                </td>
                <td className="px-5 py-4 text-sm text-pharmacare-ink">{shipment.recipient}</td>
                <td className="px-5 py-4 text-sm text-pharmacare-muted">{shipment.carrier}</td>
                <td className="px-5 py-4 text-sm font-semibold text-pharmacare-primary">{shipment.tracking}</td>
                <td className="px-5 py-4 text-sm text-pharmacare-muted">{shipment.eta}</td>
                <td className="px-5 py-4">
                  <select className="h-9 rounded-lg border border-pharmacare-line bg-pharmacare-low px-3 text-sm font-semibold text-pharmacare-ink outline-none focus:border-pharmacare-primary">
                    <option>{shipment.status}</option>
                    <option>pending</option>
                    <option>preparing</option>
                    <option>shipped</option>
                    <option>delivered</option>
                  </select>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="rounded-lg border border-pharmacare-line p-2 text-pharmacare-muted hover:bg-pharmacare-low" aria-label="Shipment actions">
                    <MoreHorizontal size={16} />
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
