import { NavLink } from "react-router-dom";
import { Boxes, ClipboardList, LayoutDashboard, LogOut, Settings, Truck, UsersRound } from "lucide-react";

const items = [
  { label: "Dashboard", to: "/staff/dashboard", icon: LayoutDashboard },
  { label: "Inventory", to: "/staff/products", icon: Boxes },
  { label: "Orders", to: "/staff/orders", icon: ClipboardList },
  { label: "Shipping", to: "/staff/shipping", icon: Truck },
  { label: "Customer CRM", to: "/staff/customers", icon: UsersRound },
];

export default function StaffSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-pharmacare-line bg-pharmacare-low p-4 md:flex md:flex-col">
      <div className="border-b border-pharmacare-line px-2 py-5">
        <h1 className="text-xl font-semibold text-pharmacare-primary">PharmaCare</h1>
        <p className="mt-2 text-lg font-semibold text-pharmacare-ink">Staff Portal</p>
        <p className="mt-1 text-sm text-pharmacare-muted">Pharmacy Operations</p>
      </div>

      <nav className="mt-5 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-pharmacare-primary text-white shadow-soft"
                    : "text-pharmacare-muted hover:bg-white hover:text-pharmacare-ink"
                }`
              }
            >
              <Icon size={19} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-pharmacare-line pt-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-pharmacare-muted hover:bg-white hover:text-pharmacare-ink">
          <Settings size={18} />
          Settings
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-pharmacare-muted hover:bg-white hover:text-pharmacare-ink">
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
