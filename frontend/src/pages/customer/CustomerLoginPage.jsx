import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { loginCustomer } from "../../api/authApi.js";

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "customer@example.com", password: "Password123!" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await loginCustomer(form);
      navigate("/customer/dashboard", { replace: true });
    } catch (apiError) {
      setError(apiError.message || "Customer login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden overflow-hidden bg-pharmacare-secondary lg:block">
        <div className="flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sm font-bold text-pharmacare-primary">
              PC
            </span>
            <span className="text-2xl font-semibold">PharmaCare</span>
          </div>
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              <ShieldCheck size={17} />
              Secure customer portal
            </p>
            <h1 className="text-5xl font-semibold leading-tight">Trusted healthcare shopping, organized for everyday care.</h1>
            <p className="mt-5 text-lg leading-8 text-white/85">
              Browse pharmacy essentials, track orders, and get safe product guidance from one clean customer workspace.
            </p>
          </div>
          <p className="text-sm text-white/70">Academic demo UI. No real medical or payment processing.</p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-pharmacare-bg px-4 py-10 sm:px-6">
        <div className="w-full max-w-md rounded-2xl border border-pharmacare-line bg-white p-8 shadow-panel">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pharmacare-primary text-sm font-bold text-white">
                PC
              </span>
              <span className="text-xl font-semibold text-pharmacare-primary">PharmaCare</span>
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-pharmacare-ink">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-pharmacare-muted">Enter your details to access your customer portal.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Email Address</span>
              <span className="relative mt-2 block">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
                <input className="h-12 w-full rounded-t-lg border-0 border-b-2 border-transparent bg-pharmacare-low pl-10 pr-4 text-pharmacare-ink outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" name="email" onChange={handleChange} placeholder="customer@example.com" type="email" value={form.email} />
              </span>
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Password</span>
              <span className="relative mt-2 block">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
                <input className="h-12 w-full rounded-t-lg border-0 border-b-2 border-transparent bg-pharmacare-low pl-10 pr-4 text-pharmacare-ink outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" name="password" onChange={handleChange} placeholder="Password123!" type="password" value={form.password} />
              </span>
            </label>
            {error ? <p className="rounded-xl bg-pharmacare-dangerSoft px-4 py-3 text-sm font-medium text-pharmacare-danger">{error}</p> : null}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-pharmacare-muted">
                <input className="rounded border-pharmacare-line text-pharmacare-primary focus:ring-pharmacare-primary" type="checkbox" />
                Remember me
              </label>
              <a className="font-semibold text-pharmacare-primary" href="#forgot">Forgot password?</a>
            </div>
            <button className="h-12 w-full rounded-xl bg-pharmacare-primary text-sm font-semibold text-white shadow-soft transition hover:bg-pharmacare-primaryHover disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login as Customer"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-pharmacare-muted">
            New to PharmaCare?{" "}
            <Link className="font-semibold text-pharmacare-primary" to="/customer/register">
              Create customer account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
