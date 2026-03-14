import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

import { platformService } from "@/services/platform";

export function ActiveCasesPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: cases = [] } = useQuery({ queryKey: ["lawyer-cases"], queryFn: platformService.listCases });
  const active = cases.filter((c: any) => c.status === "Accepted");
  const [hearingInput, setHearingInput] = useState<Record<number, string>>({});

  const closeMutation = useMutation({
    mutationFn: (id: number) => platformService.updateCase(id, { status: "Closed" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lawyer-cases"] }),
  });

  const hearingMutation = useMutation({
    mutationFn: ({ id, date }: { id: number; date: string }) => platformService.updateCase(id, { next_hearing_date: date }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lawyer-cases"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Active Cases</h1>
        <p className="mt-1 text-sm text-slate-500">Cases approved and open for work</p>
      </div>

      {active.length === 0 && (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-400">No active cases.</p>
        </div>
      )}

      {active.map((item: any) => (
        <div key={item.id} className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1">
              <p className="font-bold text-slate-900">{item.title}</p>
              {item.client_name && <p className="text-xs text-slate-500">Client: {item.client_name}</p>}
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.description}</p>
              {item.next_hearing_date && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-amber-700">
                  <Calendar className="h-3.5 w-3.5" />Next hearing: {item.next_hearing_date}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate(`/lawyer/vault/${item.id}`)} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">Open Vault</button>
              <Link to={`/lawyer/mediator/${item.id}`} className="rounded-xl border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50">Mediator</Link>
              <button onClick={() => closeMutation.mutate(item.id)} disabled={closeMutation.isPending} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">Close Case</button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
            <Calendar className="h-4 w-4 text-slate-400" />
            <input type="date" value={hearingInput[item.id] || ""} onChange={(e) => setHearingInput({ ...hearingInput, [item.id]: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-primary" />
            <button onClick={() => { if (hearingInput[item.id]) hearingMutation.mutate({ id: item.id, date: hearingInput[item.id] }); }} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200">Set Hearing Date</button>
          </div>
        </div>
      ))}
    </div>
  );
}
