import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Boxes, Clock, DollarSign, PackageCheck, ShoppingCart, UsersRound } from "lucide-react";
import { getOrders } from "../../api/orderApi.js";
import { getProducts } from "../../api/productApi.js";
import { getShipments } from "../../api/shippingApi.js";
import { getCustomers } from "../../api/userApi.js";
import { normalizeStaffOrder } from "../../api/normalizers.js";
import DashboardMetricCard from "../../components/staff/DashboardMetricCard.jsx";
import OrderTable from "../../components/staff/OrderTable.jsx";
import StaffShell from "../../components/staff/StaffShell.jsx";
import { staffMetrics, staffOrders } from "../../data/staffMockData.js";

export default function StaffDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [orderData, productData, shipmentData, customerData] = await Promise.all([
          getOrders(),
          getProducts({ is_active: "true" }),
          getShipments(),
          getCustomers(),
        ]);
        if (!isMounted) {
          return;
        }
        setOrders(orderData.map(normalizeStaffOrder));
        setProducts(productData);
        setShipments(shipmentData);
        setCustomers(customerData);
        setNotice("");
      } catch {
        if (!isMounted) {
          return;
        }
        setOrders(staffOrders);
        setProducts([]);
        setShipments([]);
        setCustomers([]);
        setNotice("Using fallback dashboard data because one or more gateway APIs are unavailable.");
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    if (notice) {
      return staffMetrics;
    }
    const pendingOrders = orders.filter((order) => ["pending", "created", "preparing"].includes(order.status)).length;
    const lowStockItems = products.filter((product) => Number(product.stock ?? 0) <= 10).length;
    const pendingShipments = shipments.filter((shipment) => ["pending", "preparing"].includes(shipment.status)).length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.raw?.total_amount ?? 0), 0);
    return [
      { label: "Total Orders", value: String(orders.length), helper: "Loaded from order_service", icon: ShoppingCart, tone: "primary" },
      { label: "Pending Fulfillment", value: String(pendingOrders), helper: "Orders needing staff review", icon: PackageCheck, tone: "warning" },
      { label: "Low Stock Items", value: String(lowStockItems), helper: "Stock at 10 units or less", icon: AlertTriangle, tone: "danger" },
      { label: "Active Customers", value: String(customers.length), helper: "Loaded from user_service", icon: UsersRound, tone: "blue" },
      { label: "Revenue", value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalRevenue), helper: `${pendingShipments} shipments in progress`, icon: DollarSign, tone: "secondary" },
    ];
  }, [customers.length, notice, orders, products, shipments]);

  return (
    <StaffShell title="Admin Dashboard" subtitle="Operational snapshot for pharmacy staff workflows.">
      {notice ? <p className="mb-5 rounded-xl bg-pharmacare-warningSoft px-4 py-3 text-sm font-medium text-pharmacare-warning">{notice}</p> : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <DashboardMetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <OrderTable orders={orders.slice(0, 5)} compact notice="Recent orders from order_service through the API Gateway." />
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
