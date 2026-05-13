import { Bell, Menu, Search, UserRound } from "lucide-react";
import StaffSidebar from "./StaffSidebar.jsx";

export default function StaffShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-pharmacare-bg">
      <div className="flex">
        <StaffSidebar />
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-pharmacare-line bg-white px-4 shadow-soft sm:px-6">
            <div className="flex items-center gap-3">
              <button className="rounded-full p-2 text-pharmacare-muted hover:bg-pharmacare-low md:hidden" aria-label="Open staff menu">
                <Menu size={21} />
              </button>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-pharmacare-muted">Staff workspace</p>
              </div>
            </div>
            <label className="relative hidden w-full max-w-md lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
              <input className="h-10 w-full rounded-full border border-transparent bg-pharmacare-low pl-10 pr-4 text-sm outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-2 focus:ring-pharmacare-primary/10" placeholder="Search orders, products, customers" type="search" />
            </label>
            <div className="flex items-center gap-2">
              <button className="rounded-full p-2 text-pharmacare-muted hover:bg-pharmacare-low" aria-label="Notifications">
                <Bell size={20} />
              </button>
              <button className="rounded-full p-2 text-pharmacare-muted hover:bg-pharmacare-low" aria-label="Staff account">
                <UserRound size={20} />
              </button>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-pharmacare-ink">{title}</h1>
              {subtitle ? <p className="mt-2 text-pharmacare-muted">{subtitle}</p> : null}
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
