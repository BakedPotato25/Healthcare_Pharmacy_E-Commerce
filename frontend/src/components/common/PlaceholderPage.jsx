import { Link } from "react-router-dom";

export default function PlaceholderPage({ title, description, role, route, nextReference }) {
  return (
    <main className="min-h-screen bg-pharmacare-bg px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 border-b border-pharmacare-line pb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-pharmacare-primary">
            {role} placeholder
          </p>
          <h1 className="text-3xl font-semibold text-pharmacare-ink">{title}</h1>
          <p className="max-w-2xl text-base text-pharmacare-muted">{description}</p>
        </header>

        <section className="rounded-lg border border-pharmacare-line bg-white p-5 shadow-panel">
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-pharmacare-muted">Route</dt>
              <dd className="mt-1 font-semibold text-pharmacare-ink">{route}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-pharmacare-muted">API state</dt>
              <dd className="mt-1 font-semibold text-pharmacare-ink">Not connected</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-pharmacare-muted">Design source</dt>
              <dd className="mt-1 font-semibold text-pharmacare-ink">{nextReference}</dd>
            </div>
          </dl>
        </section>

        <nav className="flex flex-wrap gap-3 text-sm font-medium text-pharmacare-primary">
          <Link to="/customer/dashboard">Customer dashboard</Link>
          <Link to="/customer/products">Products</Link>
          <Link to="/staff/dashboard">Staff dashboard</Link>
        </nav>
      </div>
    </main>
  );
}
