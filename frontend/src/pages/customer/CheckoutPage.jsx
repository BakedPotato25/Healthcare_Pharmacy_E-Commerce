import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CreditCard, LockKeyhole, MapPin, ShieldCheck, Truck } from "lucide-react";
import { getCart } from "../../api/cartApi.js";
import { normalizeCartItem } from "../../api/normalizers.js";
import { checkoutOrder } from "../../api/orderApi.js";
import CustomerShell from "../../components/customer/CustomerShell.jsx";
import { cartItems as fallbackCartItems, formatCurrency } from "../../data/customerMockData.js";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [notice, setNotice] = useState("");
  const [isFallback, setIsFallback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "Jane",
    lastName: "Customer",
    street: "123 Medical Way",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    phone: "555-123-4567",
    note: "",
  });

  useEffect(() => {
    async function loadCart() {
      try {
        const cart = await getCart();
        setCartItems((cart.items ?? []).map(normalizeCartItem));
        setNotice("");
        setIsFallback(false);
      } catch {
        setCartItems(fallbackCartItems.map((item) => ({ ...item, lineTotal: item.price * item.quantity })));
        setNotice("Using fallback demo cart because the API Gateway or cart endpoint is unavailable. Checkout is disabled for fallback data.");
        setIsFallback(true);
      }
    }

    loadCart();
  }, []);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.lineTotal ?? item.price * item.quantity), 0), [cartItems]);
  const shipping = cartItems.length ? 5 : 0;
  const total = subtotal + shipping;

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    if (isFallback) {
      setNotice("Fallback demo cart cannot be checked out against the backend.");
      return;
    }
    setIsSubmitting(true);
    setNotice("");
    try {
      const shippingAddress = `${form.street}, ${form.city}, ${form.state} ${form.zip}${form.note ? ` - ${form.note}` : ""}`;
      await checkoutOrder({
        shippingAddress,
        recipientName: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone,
      });
      navigate("/customer/orders");
    } catch (apiError) {
      setNotice(apiError.message || "Checkout failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomerShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-pharmacare-primarySoft px-3 py-1 text-xs font-semibold text-pharmacare-primary">
              <LockKeyhole size={14} />
              Secure Checkout
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-pharmacare-ink">Checkout</h1>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-pharmacare-muted">
            <span className="text-pharmacare-primary">Shipping</span>
            <span className="h-px w-10 bg-pharmacare-line" />
            <span>Payment</span>
            <span className="h-px w-10 bg-pharmacare-line" />
            <span>Confirmation</span>
          </div>
        </div>

        {notice ? <p className="mb-5 rounded-xl bg-pharmacare-warningSoft px-4 py-3 text-sm font-medium text-pharmacare-warning">{notice}</p> : null}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="rounded-xl border border-pharmacare-line bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pharmacare-primarySoft text-pharmacare-primary">
                <Truck size={20} />
              </span>
              <h2 className="text-xl font-semibold text-pharmacare-ink">Shipping Information</h2>
            </div>
            <form className="grid gap-5 md:grid-cols-2" onSubmit={handleCheckout}>
              {[
                ["First name", "firstName", "Jane"],
                ["Last name", "lastName", "Customer"],
                ["Street address", "street", "123 Medical Way"],
                ["City", "city", "Seattle"],
                ["State", "state", "WA"],
                ["ZIP code", "zip", "98101"],
                ["Phone", "phone", "555-123-4567"],
                ["Delivery note", "note", "Leave at reception"],
              ].map(([label, name, placeholder]) => (
                <label key={label} className={label === "Street address" ? "md:col-span-2" : ""}>
                  <span className="text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">{label}</span>
                  <input className="mt-2 h-11 w-full rounded-t-lg border-0 border-b-2 border-pharmacare-line bg-pharmacare-low px-4 outline-none focus:border-pharmacare-primary focus:bg-white focus:ring-0" name={name} onChange={handleChange} placeholder={placeholder} type="text" value={form[name]} />
                </label>
              ))}

              <div className="md:col-span-2">
                <div className="rounded-xl border border-pharmacare-line bg-pharmacare-primarySoft p-4">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 shrink-0 text-pharmacare-primary" size={20} />
                    <p className="text-sm leading-6 text-pharmacare-muted">
                      Checkout calls the API Gateway to create the order, simulated payment, and pending shipment.
                    </p>
                  </div>
                </div>

                <button className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-pharmacare-primary px-5 text-sm font-semibold text-white shadow-soft hover:bg-pharmacare-primaryHover disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={!cartItems.length || isFallback || isSubmitting}>
                  {isSubmitting ? "Creating order..." : "Continue to Payment"}
                  <ArrowRight size={17} />
                </button>
              </div>
            </form>
          </section>

          <aside className="rounded-xl border border-pharmacare-line bg-white p-6 shadow-panel">
            <h2 className="text-xl font-semibold text-pharmacare-ink">Order Summary</h2>
            <div className="mt-5 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${item.accent}`}>
                    <span className="text-sm font-semibold text-pharmacare-primary">{item.visual}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-pharmacare-ink">{item.name}</p>
                    <p className="text-xs text-pharmacare-muted">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-pharmacare-ink">{formatCurrency(item.lineTotal ?? item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-pharmacare-line pt-4 text-sm text-pharmacare-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-pharmacare-ink">
                <span>Total</span>
                <span className="text-pharmacare-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-pharmacare-low p-4">
              <div className="flex gap-3">
                <CreditCard className="mt-0.5 shrink-0 text-pharmacare-primary" size={20} />
                <div>
                  <p className="font-semibold text-pharmacare-ink">Simulated payment</p>
                  <p className="mt-1 text-sm leading-6 text-pharmacare-muted">No real payment provider is used in the MVP demo.</p>
                </div>
              </div>
            </div>
            <p className="mt-4 flex gap-2 text-xs leading-5 text-pharmacare-muted">
              <ShieldCheck size={16} className="mt-0.5 shrink-0" />
              Keep personal health information out of demo data.
            </p>
          </aside>
        </div>
      </main>
    </CustomerShell>
  );
}
