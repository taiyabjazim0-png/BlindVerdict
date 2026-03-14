import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

import { platformService } from "@/services/platform";

type Tab = "all" | "pending" | "active" | "closed";

export function MyCasesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: platformService.listCases });

  const filtered = cases.filter((c: any) => {
    if (tab === "all") return true;
    if (tab === "pending") return c.status === "Pending";
    if (tab === "active") return c.status === "Accepted";
    if (tab === "closed") return c.status === "Closed" || c.status === "Rejected";
    return true;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" }, { key: "pending", label: "Pending" },
    { key: "active", label: "Active" }, { key: "closed", label: "Closed" },
  ];

  const statusColor = (s: string) => {
    if (s === "Accepted") return "bg-emerald-50 text-emerald-700";
    if (s === "Pending") return "bg-amber-50 text-amber-700";
    if (s === "Closed") return "bg-slate-100 text-slate-600";
    return "bg-red-50 text-red-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Cases</h1>
        <p className="mt-1 text-sm text-slate-500">Raised tickets, ongoing cases, and history</p>
      </div>
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{t.label}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item: any) => (
          <div key={item.id} className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-1">{item.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(item.status)}`}>{item.status}</span>
                    {item.expected_budget && <span className="text-xs text-slate-400">Budget: {item.expected_budget}</span>}
                    {item.next_hearing_date && (
                      <span className="flex items-center gap-1 text-xs text-amber-600"><Calendar className="h-3 w-3" />{item.next_hearing_date}</span>
                    )}
                    {item.lawyer_name && <span className="text-xs text-slate-400">Lawyer: {item.lawyer_name}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {item.status === "Accepted" && (
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/client/workspace/${item.id}`); }} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">Open Workspace</button>
                  )}
                </div>
              </div>
            </div>
            {expandedId === item.id && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <h4 className="text-sm font-medium text-slate-700">Full Description</h4>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-200/60 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-400">No cases in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
