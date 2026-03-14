import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { platformService } from "@/services/platform";

export function InboxPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: cases = [] } = useQuery({ queryKey: ["lawyer-cases"], queryFn: platformService.listCases });
  const pendingCases = cases.filter((c: any) => c.status === "Pending");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => platformService.updateCase(id, { status }),
    onSuccess: (_data, vars) => { qc.invalidateQueries({ queryKey: ["lawyer-cases"] }); if (vars.status === "Accepted") navigate(`/lawyer/mediator/${vars.id}`); },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inbox</h1>
        <p className="mt-1 text-sm text-slate-500">Incoming case requests assigned to you</p>
      </div>

      {pendingCases.length === 0 && (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-400">No pending requests at the moment.</p>
        </div>
      )}

      {pendingCases.map((item: any) => (
        <div key={item.id} className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1">
                <p className="font-bold text-slate-900">{item.title}</p>
                {item.client_name && <p className="text-xs text-slate-500">From: {item.client_name}</p>}
                <p className="mt-1 text-sm text-slate-600 line-clamp-1">{item.description}</p>
                {item.expected_budget && <p className="mt-1 text-xs text-slate-400">Client budget: {item.expected_budget}</p>}
              </div>
              <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">Pending</span>
            </div>
          </div>
          {expandedId === item.id && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <h4 className="text-sm font-medium text-slate-700">Ticket Summary</h4>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => updateMutation.mutate({ id: item.id, status: "Accepted" })} className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white transition hover:opacity-90">Accept ticket</button>
                <button onClick={() => updateMutation.mutate({ id: item.id, status: "Rejected" })} className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">Reject ticket</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
