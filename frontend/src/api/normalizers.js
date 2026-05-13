const accentClasses = [
  "bg-orange-50",
  "bg-teal-50",
  "bg-sky-50",
  "bg-slate-100",
  "bg-rose-50",
  "bg-blue-50",
  "bg-emerald-50",
  "bg-violet-50",
  "bg-amber-50",
  "bg-cyan-50",
];

export function normalizeProduct(product, index = 0) {
  const category = product.category_name ?? product.category ?? "Healthcare";
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category,
    description: product.description,
    detail: product.description,
    price: Number(product.price),
    stock: Number(product.stock ?? 0),
    badge: Number(product.stock ?? 0) > 10 ? "In Stock" : "Low Stock",
    strength: `${product.stock ?? 0} in stock`,
    visual: initials(product.name),
    accent: accentClasses[index % accentClasses.length],
    imageUrl: product.image_url,
    raw: product,
  };
}

export function normalizeCartItem(item, index = 0) {
  return {
    id: item.id,
    productId: item.product_id,
    name: item.product_name,
    brand: item.product_brand,
    category: item.product_category,
    price: Number(item.unit_price),
    quantity: Number(item.quantity),
    lineTotal: Number(item.line_total),
    strength: `${item.quantity} item${Number(item.quantity) === 1 ? "" : "s"}`,
    visual: initials(item.product_name),
    accent: accentClasses[index % accentClasses.length],
    imageUrl: item.product_image_url,
    raw: item,
  };
}

export function normalizeOrder(order) {
  return {
    id: order.id,
    status: order.shipping_status || order.payment_status || order.status,
    date: order.created_at ? new Date(order.created_at).toLocaleDateString() : "Recent order",
    total: Number(order.total_amount),
    items: (order.items ?? []).map((item) => item.product_name),
    eta: order.shipping_status ? `Shipping status: ${order.shipping_status}` : `Payment status: ${order.payment_status || "pending"}`,
    raw: order,
  };
}

export function initials(name = "PC") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
