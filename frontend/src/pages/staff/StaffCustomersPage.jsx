import { useEffect, useState } from "react";
import { Edit3, Mail, StickyNote } from "lucide-react";
import { isServiceUnavailable } from "../../api/apiClient.js";
import { normalizeStaffCustomer } from "../../api/normalizers.js";
import { getCustomers } from "../../api/userApi.js";
import CustomerTable from "../../components/staff/CustomerTable.jsx";
import StaffShell from "../../components/staff/StaffShell.jsx";
import StatusBadge from "../../components/staff/StatusBadge.jsx";
import { customerRows } from "../../data/staffMockData.js";

export default function StaffCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCustomers() {
      try {
        const customerData = await getCustomers();
        if (!isMounted) {
          return;
        }
        setCustomers(customerData.map(normalizeStaffCustomer));
        setNotice("Customer accounts loaded from /api/users/?role=customer. Order counts remain TODO for a later aggregation endpoint.");
      } catch (apiError) {
        if (!isMounted) {
          return;
        }
        if (isServiceUnavailable(apiError, { includeNotFound: true })) {
          setCustomers(customerRows);
          setNotice("Using fallback customer data because the API Gateway or user_service customer endpoint is unavailable. TODO: replace mock CRM details when richer customer APIs exist.");
        } else {
          setCustomers([]);
          setNotice(apiError.message || "Unable to load customer accounts from the API Gateway.");
        }
      }
    }

    loadCustomers();
    return () => {
      isMounted = false;
    };
  }, []);

  const isFallback = notice.startsWith("Using fallback");
  const selectedCustomer = customers[0] || (isFallback ? customerRows[0] : null);

  return (
    <StaffShell title="Customer Directory" subtitle="Manage customer account context, order history, and staff notes.">
      {notice ? <p className="mb-5 rounded-xl bg-pharmacare-primarySoft px-4 py-3 text-sm font-medium text-pharmacare-primary">{notice}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <CustomerTable customers={customers} notice="Customer accounts loaded through the API Gateway." />

        {selectedCustomer ? <aside className="rounded-xl border border-pharmacare-line bg-white shadow-panel">
          <div className="border-b border-pharmacare-line p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Selected customer</p>
                <h2 className="mt-1 text-2xl font-semibold text-pharmacare-ink">{selectedCustomer.name}</h2>
                <p className="mt-1 text-sm text-pharmacare-muted">{selectedCustomer.email}</p>
              </div>
              <StatusBadge status={selectedCustomer.status} />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-pharmacare-line px-3 text-sm font-semibold text-pharmacare-ink hover:bg-pharmacare-low">
                <Mail size={16} />
                Email
              </button>
              <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-pharmacare-line px-3 text-sm font-semibold text-pharmacare-ink hover:bg-pharmacare-low">
                <Edit3 size={16} />
                Edit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5">
            <div className="rounded-xl bg-pharmacare-low p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Total Orders</p>
              <p className="mt-2 text-2xl font-semibold text-pharmacare-primary">{selectedCustomer.orders}</p>
            </div>
            <div className="rounded-xl bg-pharmacare-low p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Segment</p>
              <p className="mt-2 text-sm font-semibold text-pharmacare-ink">{selectedCustomer.segment}</p>
            </div>
          </div>

          <div className="border-t border-pharmacare-line p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-pharmacare-muted">
              <StickyNote size={16} />
              Staff Notes
            </h3>
            <p className="mt-3 rounded-xl bg-pharmacare-low p-4 text-sm leading-6 text-pharmacare-muted">
              {selectedCustomer.notes}
            </p>
            <textarea className="mt-4 min-h-24 w-full rounded-xl border border-pharmacare-line bg-pharmacare-low p-3 text-sm outline-none focus:border-pharmacare-primary focus:bg-white" placeholder="Add internal staff note..." />
            <button className="mt-3 h-10 w-full rounded-xl bg-pharmacare-primary text-sm font-semibold text-white hover:bg-pharmacare-primaryHover">
              Save Note
            </button>
          </div>
        </aside> : <aside className="rounded-xl border border-pharmacare-line bg-white p-5 text-sm text-pharmacare-muted shadow-panel">No customer is selected.</aside>}
      </div>
    </StaffShell>
  );
}
