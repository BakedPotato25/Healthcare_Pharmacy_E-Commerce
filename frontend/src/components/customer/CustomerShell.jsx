import AppHeader from "./AppHeader.jsx";
import CustomerSidebar from "./CustomerSidebar.jsx";

export default function CustomerShell({ children, withSidebar = false }) {
  if (!withSidebar) {
    return (
      <div className="min-h-screen bg-pharmacare-bg">
        <AppHeader />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pharmacare-bg">
      <AppHeader />
      <div className="mx-auto flex max-w-7xl">
        <CustomerSidebar />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
