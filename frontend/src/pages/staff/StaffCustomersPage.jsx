import { Edit3, Mail, StickyNote } from "lucide-react";
import CustomerTable from "../../components/staff/CustomerTable.jsx";
import StaffShell from "../../components/staff/StaffShell.jsx";
import StatusBadge from "../../components/staff/StatusBadge.jsx";
import { customerRows } from "../../data/staffMockData.js";

export default function StaffCustomersPage() {
  const selectedCustomer = customerRows[0];

  return (
    <StaffShell title="Customer Directory" subtitle="Manage customer account context, order history, and staff notes.">
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <CustomerTable customers={customerRows} />

        <aside className="rounded-xl border border-pharmacare-line bg-white shadow-panel">
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
        </aside>
      </div>
    </StaffShell>
  );
}
