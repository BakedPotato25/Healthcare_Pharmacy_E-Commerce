import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Boxes, PackageCheck, Truck } from "lucide-react";
import { normalizeShipment } from "../../api/normalizers.js";
import { getShipments, updateShipmentStatus } from "../../api/shippingApi.js";
import DashboardMetricCard from "../../components/staff/DashboardMetricCard.jsx";
import ShippingTable from "../../components/staff/ShippingTable.jsx";
import StaffShell from "../../components/staff/StaffShell.jsx";
import { shipmentRows, shippingMetrics } from "../../data/staffMockData.js";

export default function StaffShippingPage() {
  const [shipments, setShipments] = useState([]);
  const [notice, setNotice] = useState("");
  const isFallback = notice.startsWith("Using fallback");

  useEffect(() => {
    loadShipments();
  }, []);

  async function loadShipments(successNotice = "") {
    try {
      const shipmentData = await getShipments();
      setShipments(shipmentData.map(normalizeShipment));
      setNotice(successNotice);
    } catch {
      setShipments(shipmentRows);
      setNotice("Using fallback shipment data because the API Gateway or shipping service is unavailable.");
    }
  }

  const metrics = useMemo(() => {
    if (isFallback) {
      return shippingMetrics;
    }
    const pending = shipments.filter((shipment) => shipment.status === "pending").length;
    const shipped = shipments.filter((shipment) => shipment.status === "shipped").length;
    const delivered = shipments.filter((shipment) => shipment.status === "delivered").length;
    const exceptions = shipments.filter((shipment) => shipment.status === "cancelled").length;
    return [
      { label: "Pending Orders", value: String(pending), helper: "Needs packing", icon: Boxes, tone: "warning" },
      { label: "Shipped", value: String(shipped), helper: "Simulated shipments", icon: Truck, tone: "primary" },
      { label: "Cancelled", value: String(exceptions), helper: "Exceptions", icon: AlertTriangle, tone: "danger" },
      { label: "Delivered", value: String(delivered), helper: "Completed deliveries", icon: PackageCheck, tone: "blue" },
    ];
  }, [isFallback, shipments]);

  const handleStatusChange = async (shipment, status) => {
    if (isFallback) {
      setNotice("Fallback shipments cannot be updated. Start the backend services to manage shipping.");
      return;
    }
    try {
      await updateShipmentStatus({ shipmentId: shipment.id, status });
      await loadShipments("Shipment status updated through /api/shipments/:id/status/.");
    } catch (apiError) {
      setNotice(apiError.message || "Unable to update shipment status.");
    }
  };

  return (
    <StaffShell title="Shipping Logistics" subtitle="Manage outbound orders and track simulated delivery statuses.">
      {notice ? <p className="mb-5 rounded-xl bg-pharmacare-warningSoft px-4 py-3 text-sm font-medium text-pharmacare-warning">{notice}</p> : null}
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <DashboardMetricCard key={metric.label} {...metric} />
        ))}
      </section>
      <ShippingTable shipments={shipments} notice="Shipments loaded from /api/shipments/ through the API Gateway." onStatusChange={handleStatusChange} />
    </StaffShell>
  );
}
