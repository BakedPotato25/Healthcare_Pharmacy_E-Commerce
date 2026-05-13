import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { registerCustomer } from "../../api/authApi.js";

export default function CustomerRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
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
      await registerCustomer(form);
      navigate("/customer/login");
    } catch (apiError) {
      setError(apiError.message || "Customer registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Customer registration is handled through the API Gateway and creates customer-role accounts for the demo.
            </p>
          </div>
        </section>

        <section className="p-8 lg:p-12">
          <h2 className="text-3xl font-semibold text-pharmacare-ink">Create account</h2>
          <p className="mt-2 text-sm leading-6 text-pharmacare-muted">Use demo-friendly information for the academic customer flow.</p>
          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Full name</span>
              <span className="relative mt-2 block">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
                <input className="h-12 w-full rounded-t-lg border-0 border-b-2 border-transparent bg-pharmacare-low pl-10 pr-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" name="username" onChange={handleChange} placeholder="Jane Customer" type="text" value={form.username} />
              </span>
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Email Address</span>
              <span className="relative mt-2 block">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
                <input className="h-12 w-full rounded-t-lg border-0 border-b-2 border-transparent bg-pharmacare-low pl-10 pr-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" name="email" onChange={handleChange} placeholder="customer@example.com" type="email" value={form.email} />
              </span>
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">Password</span>
              <span className="relative mt-2 block">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-pharmacare-outline" size={18} />
                <input className="h-12 w-full rounded-t-lg border-0 border-b-2 border-transparent bg-pharmacare-low pl-10 pr-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" name="password" onChange={handleChange} placeholder="Password123!" type="password" value={form.password} />
              </span>
            </label>
            {error ? <p className="rounded-xl bg-pharmacare-dangerSoft px-4 py-3 text-sm font-medium text-pharmacare-danger">{error}</p> : null}
            <button className="mt-2 h-12 rounded-xl bg-pharmacare-primary text-sm font-semibold text-white shadow-soft hover:bg-pharmacare-primaryHover disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Customer Account"}
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
