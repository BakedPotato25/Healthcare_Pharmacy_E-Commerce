import { Link } from "react-router-dom";
import { LockKeyhole, Mail, UserRound } from "lucide-react";

export default function CustomerRegisterPage() {
  return (
    <main className="min-h-screen bg-pharmacare-bg px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl border border-pharmacare-line bg-white shadow-panel lg:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-pharmacare-secondary p-8 text-white lg:p-12">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sm font-bold text-pharmacare-primary">
              PC
            </span>
            <span className="text-2xl font-semibold">PharmaCare</span>
          </div>
          <div className="mt-20 max-w-md">
            <h1 className="text-4xl font-semibold leading-tight">Create a customer account for pharmacy shopping.</h1>
            <p className="mt-5 leading-7 text-white/85">
              Registration is mocked in this phase. Backend authentication will be connected through the API Gateway later.
            </p>
          </div>
        </section>

        <section className="p-8 lg:p-12">
          <h2 className="text-3xl font-semibold text-pharmacare-ink">Create account</h2>
          <p className="mt-2 text-sm leading-6 text-pharmacare-muted">Use demo-friendly information for the academic customer flow.</p>
          <form className="mt-8 grid gap-5">
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Full name</span>
              <span className="relative mt-2 block">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
                <input className="h-12 w-full rounded-t-lg border-0 border-b-2 border-transparent bg-pharmacare-low pl-10 pr-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" placeholder="Jane Customer" type="text" />
              </span>
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Email Address</span>
              <span className="relative mt-2 block">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
                <input className="h-12 w-full rounded-t-lg border-0 border-b-2 border-transparent bg-pharmacare-low pl-10 pr-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" placeholder="customer@example.com" type="email" />
              </span>
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Password</span>
              <span className="relative mt-2 block">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
                <input className="h-12 w-full rounded-t-lg border-0 border-b-2 border-transparent bg-pharmacare-low pl-10 pr-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" placeholder="Password123!" type="password" />
              </span>
            </label>
            <button className="mt-2 h-12 rounded-xl bg-pharmacare-primary text-sm font-semibold text-white shadow-soft hover:bg-pharmacare-primaryHover" type="button">
              Create Customer Account
            </button>
          </form>
          <p className="mt-6 text-sm text-pharmacare-muted">
            Already have an account?{" "}
            <Link className="font-semibold text-pharmacare-primary" to="/customer/login">
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
