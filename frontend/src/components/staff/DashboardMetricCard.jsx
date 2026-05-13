const toneStyles = {
  primary: "bg-pharmacare-primarySoft text-pharmacare-primary",
  secondary: "bg-pharmacare-secondarySoft text-pharmacare-secondary",
  warning: "bg-pharmacare-warningSoft text-pharmacare-warning",
  danger: "bg-pharmacare-dangerSoft text-pharmacare-danger",
  blue: "bg-blue-50 text-pharmacare-blue",
};

export default function DashboardMetricCard({ label, value, helper, icon: Icon, tone = "primary" }) {
  return (
    <article className="rounded-xl border border-pharmacare-line bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-pharmacare-muted">{label}</p>
        {Icon ? (
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${toneStyles[tone]}`}>
            <Icon size={18} />
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-semibold text-pharmacare-ink">{value}</p>
      <p className="mt-1 text-sm text-pharmacare-muted">{helper}</p>
    </article>
  );
}
