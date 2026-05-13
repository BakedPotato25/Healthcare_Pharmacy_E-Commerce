import { ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import CartItemRow from "../../components/customer/CartItemRow.jsx";
import CustomerShell from "../../components/customer/CustomerShell.jsx";
import EmptyState from "../../components/customer/EmptyState.jsx";
import { cartItems, formatCurrency } from "../../data/customerMockData.js";

export default function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5;
  const total = subtotal + shipping;

  return (
    <CustomerShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-pharmacare-ink">Your Cart</h1>
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <section className="flex-1 space-y-4">
            {cartItems.length ? (
              cartItems.map((item) => <CartItemRow key={item.id} item={item} />)
            ) : (
              <EmptyState
                icon={ShoppingBag}
                title="Your cart is empty"
                message="Browse healthcare products and add items for checkout."
                action={<Link className="rounded-xl bg-pharmacare-primary px-4 py-2 text-sm font-semibold text-white" to="/customer/products">Shop Products</Link>}
              />
            )}
          </section>

          <aside className="w-full lg:w-96">
            <div className="sticky top-24 rounded-xl border border-pharmacare-line bg-white p-6 shadow-panel">
              <h2 className="text-xl font-semibold text-pharmacare-ink">Order Summary</h2>
              <div className="mt-5 space-y-3 text-sm text-pharmacare-muted">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated tax</span>
                  <span>{formatCurrency(0)}</span>
                </div>
              </div>
              <div className="mt-5 flex justify-between border-t border-pharmacare-line pt-4 text-xl font-semibold text-pharmacare-ink">
                <span>Total</span>
                <span className="text-pharmacare-primary">{formatCurrency(total)}</span>
              </div>
              <Link className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-pharmacare-primary text-sm font-semibold text-white shadow-soft hover:bg-pharmacare-primaryHover" to="/customer/checkout">
                Proceed to Checkout
                <ArrowRight size={17} />
              </Link>
              <p className="mt-4 flex gap-2 text-sm leading-6 text-pharmacare-muted">
                <ShieldCheck className="mt-0.5 shrink-0 text-pharmacare-primary" size={18} />
                Secure checkout mock flow. No real payment is processed in this phase.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </CustomerShell>
  );
}
