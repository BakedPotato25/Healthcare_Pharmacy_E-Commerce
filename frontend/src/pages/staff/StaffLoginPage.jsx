import { Link } from "react-router-dom";
import { BriefcaseBusiness, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

export default function StaffLoginPage() {
  return (
    <main className="min-h-screen bg-pharmacare-bg">
      <header className="flex h-16 items-center border-b border-pharmacare-line bg-white px-6 shadow-soft">
        <Link to="/staff/login" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pharmacare-primary text-sm font-bold text-white">
            PC
          </span>
          <span className="text-xl font-semibold text-pharmacare-primary">PharmaCare</span>
        </Link>
      </header>

      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-pharmacare-line bg-white p-8 shadow-panel">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-pharmacare-primarySoft text-pharmacare-primary">
            <BriefcaseBusiness size={24} />
          </div>
          <h1 className="text-3xl font-semibold text-pharmacare-ink">Staff Portal</h1>
          <p className="mt-2 text-sm leading-6 text-pharmacare-muted">Sign in to access pharmacy operations.</p>

          <form className="mt-8 space-y-5">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Email Address / Employee ID</span>
              <span className="relative mt-2 block">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
                <input className="h-12 w-full rounded-t-lg border-0 border-b-2 border-pharmacare-line bg-pharmacare-low pl-10 pr-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" placeholder="staff@example.com" type="text" />
              </span>
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Password</span>
              <span className="relative mt-2 block">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
                <input className="h-12 w-full rounded-t-lg border-0 border-b-2 border-pharmacare-line bg-pharmacare-low pl-10 pr-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" placeholder="Password123!" type="password" />
              </span>
            </label>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-pharmacare-muted">
                <input className="rounded border-pharmacare-line text-pharmacare-primary focus:ring-pharmacare-primary" type="checkbox" />
                Remember device
              </label>
              <a className="font-semibold text-pharmacare-blue" href="#forgot">Forgot password?</a>
            </div>
            <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-pharmacare-primary text-sm font-semibold text-white shadow-soft hover:bg-pharmacare-primaryHover" type="button">
              <ShieldCheck size={18} />
              Login as Staff
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-pharmacare-line bg-pharmacare-low p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Authorized pharmacy staff only</p>
            <p className="mt-2 text-sm leading-6 text-pharmacare-muted">Customer users should use the separate customer login flow.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
