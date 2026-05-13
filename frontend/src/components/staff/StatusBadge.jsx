const statusConfig = {
  in_stock: "bg-pharmacare-primarySoft text-pharmacare-primary border-pharmacare-primary/20",
  low_stock: "bg-pharmacare-warningSoft text-pharmacare-warning border-pharmacare-warning/20",
  out_of_stock: "bg-pharmacare-dangerSoft text-pharmacare-danger border-pharmacare-danger/20",
  processing: "bg-pharmacare-secondarySoft text-pharmacare-secondary border-pharmacare-secondary/20",
  pending: "bg-pharmacare-warningSoft text-pharmacare-warning border-pharmacare-warning/20",
  ready_to_ship: "bg-pharmacare-primarySoft text-pharmacare-primary border-pharmacare-primary/20",
  paid: "bg-pharmacare-primarySoft text-pharmacare-primary border-pharmacare-primary/20",
  preparing: "bg-pharmacare-secondarySoft text-pharmacare-secondary border-pharmacare-secondary/20",
  shipped: "bg-blue-50 text-pharmacare-blue border-pharmacare-blue/20",
  delivered: "bg-pharmacare-low text-pharmacare-muted border-pharmacare-line",
  active: "bg-pharmacare-primarySoft text-pharmacare-primary border-pharmacare-primary/20",
  inactive: "bg-pharmacare-low text-pharmacare-muted border-pharmacare-line",
};

const labels = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
  processing: "Processing",
  pending: "Pending",
  ready_to_ship: "Ready to Ship",
  paid: "Paid",
  preparing: "Preparing",
  shipped: "Shipped",
  delivered: "Delivered",
  active: "Active",
  inactive: "Inactive",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex min-w-20 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusConfig[status] ?? "bg-pharmacare-low text-pharmacare-muted border-pharmacare-line"}`}>
      {labels[status] ?? status}
    </span>
  );
}
