export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="rounded-xl border border-dashed border-pharmacare-line bg-white p-8 text-center">
      {Icon ? (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pharmacare-primarySoft text-pharmacare-primary">
          <Icon size={22} />
        </div>
      ) : null}
      <h2 className="text-lg font-semibold text-pharmacare-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-pharmacare-muted">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
