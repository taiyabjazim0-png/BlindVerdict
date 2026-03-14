export function Timeline({
  events,
}: {
  events: { day: string; title: string; detail: string }[];
}) {
  return (
    <div className="space-y-4">
      {events.map((e, idx) => (
        <div key={`${e.day}-${idx}`} className="flex gap-4">
          <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{e.day}</p>
            <p className="text-sm font-semibold text-slate-900">{e.title}</p>
            <p className="text-sm text-slate-600">{e.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
