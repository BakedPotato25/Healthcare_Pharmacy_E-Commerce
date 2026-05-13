const styles = {
  "In Stock": "bg-pharmacare-secondarySoft text-pharmacare-secondary",
  "Low Stock": "bg-pharmacare-warningSoft text-pharmacare-warning",
  processing: "bg-pharmacare-secondarySoft text-pharmacare-secondary",
  shipped: "bg-pharmacare-primarySoft text-pharmacare-primary",
  delivered: "bg-pharmacare-low text-pharmacare-muted",
  paid: "bg-pharmacare-primarySoft text-pharmacare-primary",
  pending: "bg-pharmacare-warningSoft text-pharmacare-warning",
  cancelled: "bg-pharmacare-dangerSoft text-pharmacare-danger",
};

export default function StatusBadge({ status }) {
  const label = status
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] ?? styles[label] ?? "bg-pharmacare-low text-pharmacare-muted"}`}>
      {label}
    </span>
  );
}
