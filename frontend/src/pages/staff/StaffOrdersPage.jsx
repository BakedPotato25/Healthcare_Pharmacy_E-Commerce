import { useEffect, useState } from "react";
import { CreditCard, MapPin, PackageCheck, Printer } from "lucide-react";
import { getOrders } from "../../api/orderApi.js";
import { normalizeStaffOrder } from "../../api/normalizers.js";
import OrderTable from "../../components/staff/OrderTable.jsx";
import StaffShell from "../../components/staff/StaffShell.jsx";
import StatusBadge from "../../components/staff/StatusBadge.jsx";
import { staffOrders } from "../../data/staffMockData.js";

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const orderData = await getOrders();
        if (!isMounted) {
          return;
        }
        setOrders(orderData.map(normalizeStaffOrder));
        setNotice("");
      } catch {
        if (!isMounted) {
          return;
        }
        setOrders(staffOrders);
        setNotice("Using fallback order data because the API Gateway or order service is unavailable.");
      }
    }

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedOrder = orders[0] || staffOrders[0];
  const selectedItems = selectedOrder.itemNames?.length ? selectedOrder.itemNames : ["Order item snapshots load from order_service"];

  return (
    <StaffShell title="Order Management" subtitle="Review and process incoming pharmacy e-commerce orders.">
      {notice ? <p className="mb-5 rounded-xl bg-pharmacare-warningSoft px-4 py-3 text-sm font-medium text-pharmacare-warning">{notice}</p> : null}
      <div className="mb-5 flex gap-2 overflow-x-auto">
        {["All Active", "Pending", "Processing", "Ready to Ship"].map((label, index) => (
          <button key={label} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold ${index === 0 ? "bg-pharmacare-primary text-white" : "border border-pharmacare-line bg-white text-pharmacare-muted hover:bg-pharmacare-low"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <OrderTable orders={orders} notice="Staff order queue loaded from /api/orders/." />

        <section className="rounded-xl border border-pharmacare-line bg-white shadow-panel">
          <div className="flex items-start justify-between gap-4 border-b border-pharmacare-line p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Selected order</p>
              <h2 className="mt-1 text-2xl font-semibold text-pharmacare-ink">{selectedOrder.id}</h2>
              <p className="mt-1 text-sm text-pharmacare-muted">{selectedOrder.created}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={selectedOrder.status} />
              <button className="rounded-lg border border-pharmacare-line p-2 text-pharmacare-muted hover:bg-pharmacare-low" aria-label="Print invoice">
                <Printer size={18} />
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-5 lg:grid-cols-2">
            <div className="rounded-xl border border-pharmacare-line bg-pharmacare-low p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-pharmacare-muted">
                <PackageCheck size={16} />
                Customer Info
              </h3>
              <p className="mt-3 font-semibold text-pharmacare-ink">{selectedOrder.customer}</p>
              <p className="mt-1 text-sm text-pharmacare-muted">{selectedOrder.email}</p>
            </div>
            <div className="rounded-xl border border-pharmacare-line bg-pharmacare-low p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-pharmacare-muted">
                <MapPin size={16} />
                Shipping Address
              </h3>
              <p className="mt-3 text-sm leading-6 text-pharmacare-ink">{selectedOrder.address}</p>
            </div>
            <div className="rounded-xl border border-pharmacare-line bg-white p-4 lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-pharmacare-muted">Order Items</h3>
              <div className="mt-3 divide-y divide-pharmacare-line rounded-lg border border-pharmacare-line">
                {selectedItems.map((item, index) => (
                  <div key={item} className="flex items-center justify-between p-3">
                    <div>
                      <p className="font-semibold text-pharmacare-ink">{item}</p>
                      <p className="text-sm text-pharmacare-muted">Qty {index + 1} • Snapshot stored at checkout</p>
                    </div>
                    <span className="font-semibold text-pharmacare-primary">{index === 0 ? "$37.98" : "$16.75"}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-pharmacare-line bg-pharmacare-low p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-pharmacare-muted">
                <CreditCard size={16} />
                Payment Details
              </h3>
              <div className="mt-3 flex items-center justify-between">
                <StatusBadge status={selectedOrder.payment} />
                <span className="font-semibold text-pharmacare-primary">{selectedOrder.total}</span>
              </div>
            </div>
            <div className="rounded-xl border border-pharmacare-line bg-pharmacare-low p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-pharmacare-muted">Update Status</h3>
              <button className="mt-3 h-10 w-full rounded-xl bg-pharmacare-primary text-sm font-semibold text-white hover:bg-pharmacare-primaryHover">
                Mark Ready for Shipment
              </button>
            </div>
          </div>
        </section>
      </div>
    </StaffShell>
  );
}
