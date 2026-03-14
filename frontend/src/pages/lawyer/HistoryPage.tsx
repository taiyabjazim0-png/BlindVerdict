import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { platformService } from "@/services/platform";

export function HistoryPage() {
  const { data: cases = [] } = useQuery({ queryKey: ["lawyer-cases"], queryFn: platformService.listCases });
  const closed = cases.filter((c: any) => c.status === "Rejected" || c.status === "Closed");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { data: logs = [] } = useQuery({ queryKey: ["case-logs", expandedId], queryFn: () => platformService.getCaseLogs(expandedId!), enabled: !!expandedId });

  const statusLabel = (s: string) => s === "Closed" ? "Closed" : "Rejected";
  const statusColor = (s: string) => s === "Closed" ? "bg-slate-100 text-slate-600" : "bg-red-50 text-red-600";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">History</h1>
        <p className="mt-1 text-sm text-slate-500">Closed and rejected cases with summaries and activity logs.</p>
      </div>

      {closed.length === 0 && (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-400">No closed cases yet.</p>
        </div>
      )}

      {closed.map((item: any) => (
        <div key={item.id} className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{item.title}</p>
                {item.client_name && <p className="text-xs text-slate-500">Client: {item.client_name}</p>}
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.description}</p>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(item.status)}`}>{statusLabel(item.status)}</span>
            </div>
          </div>
          {expandedId === item.id && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <h4 className="text-sm font-medium text-slate-700">Detailed Summary</h4>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              <h4 className="mt-4 text-sm font-medium text-slate-700">Activity Logs</h4>
              <div className="mt-2 space-y-2">
                {logs.length === 0 && <p className="text-xs text-slate-400">No logs.</p>}
                {logs.map((log: any) => (
                  <div key={log.id} className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
                    <span className="font-medium text-slate-500">{new Date(log.created_at).toLocaleDateString()}</span> — {log.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
