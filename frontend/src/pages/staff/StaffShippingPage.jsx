import DashboardMetricCard from "../../components/staff/DashboardMetricCard.jsx";
import ShippingTable from "../../components/staff/ShippingTable.jsx";
import StaffShell from "../../components/staff/StaffShell.jsx";
import { shipmentRows, shippingMetrics } from "../../data/staffMockData.js";

export default function StaffShippingPage() {
  return (
    <StaffShell title="Shipping Logistics" subtitle="Manage outbound orders and track simulated delivery statuses.">
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {shippingMetrics.map((metric) => (
          <DashboardMetricCard key={metric.label} {...metric} />
        ))}
      </section>
      <ShippingTable shipments={shipmentRows} />
    </StaffShell>
  );
}
