import { Link, NavLink } from "react-router-dom";
import { Bell, Menu, Search, ShoppingCart, UserRound } from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/customer/dashboard" },
  { label: "Products", to: "/customer/products" },
  { label: "Orders", to: "/customer/orders" },
  { label: "AI Assistant", to: "/customer/chatbot" },
];

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-pharmacare-line bg-white/95 shadow-soft backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 text-pharmacare-muted hover:bg-pharmacare-low md:hidden" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <Link to="/customer/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pharmacare-primary text-sm font-bold text-white">
              PC
            </span>
            <span className="font-semibold text-pharmacare-primary">PharmaCare</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-pharmacare-primarySoft text-pharmacare-primary"
                    : "text-pharmacare-muted hover:bg-pharmacare-low hover:text-pharmacare-ink"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden flex-1 justify-center lg:flex">
          <label className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
            <input
              className="h-10 w-full rounded-full border border-transparent bg-pharmacare-low pl-10 pr-4 text-sm text-pharmacare-ink outline-none transition focus:border-pharmacare-primary focus:bg-white focus:ring-2 focus:ring-pharmacare-primary/10"
              placeholder="Search healthcare products"
              type="search"
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/customer/cart" className="relative rounded-full p-2 text-pharmacare-muted hover:bg-pharmacare-low" aria-label="Cart">
            <ShoppingCart size={21} />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-pharmacare-danger" />
          </Link>
          <button className="rounded-full p-2 text-pharmacare-muted hover:bg-pharmacare-low" aria-label="Notifications">
            <Bell size={21} />
          </button>
          <button className="rounded-full p-2 text-pharmacare-muted hover:bg-pharmacare-low" aria-label="Account">
            <UserRound size={21} />
          </button>
        </div>
      </div>
    </header>
  );
}
