import { Activity, Boxes, Clock } from "lucide-react";
import DashboardMetricCard from "../../components/staff/DashboardMetricCard.jsx";
import OrderTable from "../../components/staff/OrderTable.jsx";
import StaffShell from "../../components/staff/StaffShell.jsx";
import { staffMetrics, staffOrders } from "../../data/staffMockData.js";

export default function StaffDashboardPage() {
  return (
    <StaffShell title="Admin Dashboard" subtitle="Operational snapshot for pharmacy staff workflows.">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {staffMetrics.map((metric) => (
          <DashboardMetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <OrderTable orders={staffOrders} compact />
        <aside className="space-y-4">
          <div className="rounded-xl border border-pharmacare-line bg-white p-5 shadow-soft">
            <h2 className="text-xl font-semibold text-pharmacare-ink">Staff Activity</h2>
            <div className="mt-4 space-y-4">
              {[
                ["Inventory updated", "Digital thermometer stock adjusted", Boxes],
                ["Order processed", "ORD-9482 marked processing", Activity],
                ["Shipment queued", "MediShip pickup scheduled", Clock],
              ].map(([title, text, Icon]) => (
                <div key={title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pharmacare-primarySoft text-pharmacare-primary">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="font-semibold text-pharmacare-ink">{title}</p>
                    <p className="text-sm text-pharmacare-muted">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-pharmacare-line bg-pharmacare-secondary p-5 text-white shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/75">Staff workflow</p>
            <h2 className="mt-3 text-xl font-semibold">Separate from customer UI</h2>
            <p className="mt-2 text-sm leading-6 text-white/85">This workspace is for staff inventory, order fulfillment, shipping, and CRM mock operations.</p>
          </div>
        </aside>
      </section>
    </StaffShell>
  );
}
