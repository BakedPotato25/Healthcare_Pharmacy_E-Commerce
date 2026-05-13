import { NavLink } from "react-router-dom";
import { ClipboardList, Home, LogOut, MessageCircle, PackageSearch, Settings, ShoppingCart } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", to: "/customer/dashboard", icon: Home },
  { label: "Products", to: "/customer/products", icon: PackageSearch },
  { label: "Cart", to: "/customer/cart", icon: ShoppingCart },
  { label: "Orders", to: "/customer/orders", icon: ClipboardList },
  { label: "AI Assistant", to: "/customer/chatbot", icon: MessageCircle },
];

export default function CustomerSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-pharmacare-line bg-pharmacare-low px-4 py-5 md:block">
      <div className="mb-6 border-b border-pharmacare-line pb-5">
        <p className="text-lg font-semibold text-pharmacare-primary">PharmaCare</p>
        <p className="mt-1 text-sm text-pharmacare-muted">Customer Portal</p>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-pharmacare-primary shadow-soft"
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

      <div className="mt-8 border-t border-pharmacare-line pt-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-pharmacare-muted hover:bg-white hover:text-pharmacare-ink">
          <Settings size={18} />
          Settings
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-pharmacare-muted hover:bg-white hover:text-pharmacare-ink">
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
