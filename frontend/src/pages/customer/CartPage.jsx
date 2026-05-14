import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { isServiceUnavailable } from "../../api/apiClient.js";
import { getCart, removeCartItem, updateCartItem } from "../../api/cartApi.js";
import { normalizeCartItem } from "../../api/normalizers.js";
import CartItemRow from "../../components/customer/CartItemRow.jsx";
import CustomerShell from "../../components/customer/CustomerShell.jsx";
import EmptyState from "../../components/customer/EmptyState.jsx";
import { cartItems as fallbackCartItems, formatCurrency } from "../../data/customerMockData.js";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [notice, setNotice] = useState("");
  const [isFallback, setIsFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const cart = await getCart();
      setCartItems((cart.items ?? []).map(normalizeCartItem));
      setNotice("");
      setIsFallback(false);
    } catch (apiError) {
      if (isServiceUnavailable(apiError)) {
        setCartItems(fallbackCartItems.map((item) => ({ ...item, lineTotal: item.price * item.quantity })));
        setNotice("Using fallback demo cart because the API Gateway or cart endpoint is unavailable.");
        setIsFallback(true);
      } else {
        setCartItems([]);
        setNotice(apiError.message || "Unable to load cart from the API Gateway.");
        setIsFallback(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.lineTotal ?? item.price * item.quantity), 0), [cartItems]);
  const shipping = cartItems.length ? 5 : 0;
  const total = subtotal + shipping;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleUpdateQuantity = async (item, quantity) => {
    if (isFallback) {
      setNotice("Fallback demo cart cannot update backend quantities.");
      return;
    }
    try {
      await updateCartItem({ itemId: item.id, quantity });
      await loadCart();
    } catch (apiError) {
      setNotice(apiError.message || "Unable to update cart item.");
    }
  };

  const handleRemove = async (item) => {
    if (isFallback) {
      setNotice("Fallback demo cart cannot remove backend items.");
      return;
    }
    try {
      await removeCartItem(item.id);
      await loadCart();
    } catch (apiError) {
      setNotice(apiError.message || "Unable to remove cart item.");
    }
  };

  return (
    <CustomerShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-pharmacare-ink">Your Cart</h1>
        {notice ? <p className="mt-4 rounded-xl bg-pharmacare-warningSoft px-4 py-3 text-sm font-medium text-pharmacare-warning">{notice}</p> : null}
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <section className="flex-1 space-y-4">
            {isLoading ? (
              <p className="text-sm text-pharmacare-muted">Loading cart...</p>
            ) : cartItems.length ? (
              cartItems.map((item) => <CartItemRow key={item.id} item={item} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemove} />)
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
                  <span>Subtotal ({itemCount} items)</span>
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
              <Link className={`mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white shadow-soft ${cartItems.length ? "bg-pharmacare-primary hover:bg-pharmacare-primaryHover" : "pointer-events-none bg-pharmacare-outline"}`} to="/customer/checkout">
                Proceed to Checkout
                <ArrowRight size={17} />
              </Link>
              <p className="mt-4 flex gap-2 text-sm leading-6 text-pharmacare-muted">
                <ShieldCheck className="mt-0.5 shrink-0 text-pharmacare-primary" size={18} />
                Checkout creates simulated payment and shipping records through the API Gateway.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </CustomerShell>
  );
}
